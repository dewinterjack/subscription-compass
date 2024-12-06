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
      const expiresAt = input.type === "card" && input.expiryMonth && input.expiryYear
        ? new Date(
            parseInt(input.expiryYear),
            parseInt(input.expiryMonth) - 1,
            1
          )
        : null;

      return ctx.db.paymentMethod.create({
        data: {
          type: input.type,
          name: input.name,
          number: input.number,
          expiresAt,
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });
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
          number: input.data.number,
          expiresAt,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const paymentMethod = await ctx.db.paymentMethod.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      })

      if (!paymentMethod) {
        throw new Error("Payment method not found")
      }

      return ctx.db.paymentMethod.delete({
        where: { id: input.id },
      })
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