import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const trialRouter = createTRPCRouter({
    create: protectedProcedure
    .input(z.object({
        name: z.string().min(1),
        trialEndAt: z.date()
    }))
    .mutation(async ({ctx,input}) => {
      return ctx.db.trial.create({
        data: {
          name: input.name,
          endAt: input.trialEndAt,
          createdBy: { connect: { id: ctx.user?.id } },
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.trial.findMany({
      where: { createdBy: { id: ctx.user?.id } },
      orderBy: { createdAt: "desc" },
    });
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.trial.delete({ where: { id: input.id } });
    }),
});
