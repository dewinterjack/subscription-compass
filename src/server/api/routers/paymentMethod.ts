import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { paymentMethodFormSchema } from "@/lib/schema/paymentMethod"

export const paymentMethodRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.paymentMethod.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }),

  create: protectedProcedure
    .input(paymentMethodFormSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if this is the first payment method
      const existingPaymentMethods = await ctx.db.paymentMethod.findMany({
        where: { userId: ctx.user.id },
      });

      const expiresAt = input.type === "card" && input.expiryMonth && input.expiryYear
        ? new Date(
            parseInt(input.expiryYear),
            parseInt(input.expiryMonth) - 1,
            1
          )
        : null;

      const paymentMethod = await ctx.db.paymentMethod.create({
        data: {
          type: input.type,
          name: input.name,
          expiresAt,
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });

      // If this is the first payment method, set it as default
      if (existingPaymentMethods.length === 0) {
        await ctx.db.user.update({
          where: { id: ctx.user.id },
          data: { defaultPaymentMethodId: paymentMethod.id },
        });
      }

      return paymentMethod;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: paymentMethodFormSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const expiresAt = input.data.type === "card" && input.data.expiryMonth && input.data.expiryYear
        ? new Date(
            parseInt(input.data.expiryYear),
            parseInt(input.data.expiryMonth) - 1,
            1
          )
        : null;

      return ctx.db.paymentMethod.update({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        data: {
          name: input.data.name,
          expiresAt,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.user.id },
        select: { defaultPaymentMethodId: true },
      });

      const paymentMethod = await ctx.db.paymentMethod.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!paymentMethod) {
        throw new Error("Payment method not found");
      }
      if (user?.defaultPaymentMethodId === input.id) {
        const alternativePaymentMethod = await ctx.db.paymentMethod.findFirst({
          where: {
            userId: ctx.user.id,
            id: { not: input.id },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (alternativePaymentMethod) {
          await ctx.db.user.update({
            where: { id: ctx.user.id },
            data: { defaultPaymentMethodId: alternativePaymentMethod.id },
          });
        } else {
          await ctx.db.user.update({
            where: { id: ctx.user.id },
            data: { defaultPaymentMethodId: null },
          });
        }
      }

      return ctx.db.paymentMethod.delete({
        where: { id: input.id },
      });
    }),

  setAsDefault: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.user.id },
        data: { defaultPaymentMethodId: input.id }
      });
    }),
}) 