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
      return ctx.db.account.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      })
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
}) 