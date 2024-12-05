import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { accountFormSchema } from "@/lib/schema/account"

export const accountRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.account.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }),

  create: protectedProcedure
    .input(accountFormSchema)
    .mutation(async ({ ctx, input }) => {
      const existingAccounts = await ctx.db.account.count({
        where: { userId: ctx.user.id }
      });

      const account = await ctx.db.account.create({
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
            defaultPaymentMethodId: account.id
          }
        });
      }

      return account;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: accountFormSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.db.account.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      })

      if (!account) {
        throw new Error("Account not found")
      }

      return ctx.db.account.update({
        where: { id: input.id },
        data: input.data,
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.db.account.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      })

      if (!account) {
        throw new Error("Account not found")
      }

      return ctx.db.account.delete({
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