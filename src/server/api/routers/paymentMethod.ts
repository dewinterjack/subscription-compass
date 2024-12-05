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
      const existingAccounts = await ctx.db.paymentMethod.count({
        where: { userId: ctx.user.id }
      });

      const paymentMethod = await ctx.db.paymentMethod.create({
        data: {
          ...input,
          user: {
            connect: { id: ctx.user.id }
          }
        }
      });

      // If this is the first account, set it as default
      if (existingAccounts === 0) {
        await ctx.db.user.update({
          where: { id: ctx.user.id },
          data: {
            defaultPaymentMethodId: paymentMethod.id
          }
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
      const paymentMethod = await ctx.db.paymentMethod.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      })

      if (!paymentMethod) {
        throw new Error("Payment method not found")
      }

      return ctx.db.paymentMethod.update({
        where: { id: input.id },
        data: input.data,
      })
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