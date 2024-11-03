import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { BillingCycle } from "@prisma/client";

export const subscriptionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      cost: z.number().positive(),
      billingCycle: z.nativeEnum(BillingCycle),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subscription.create({
        data: {
          name: input.name,
          cost: input.cost,
          billingCycle: input.billingCycle,
          createdBy: { connect: { id: ctx.user?.id } },
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const subscriptions = ctx.db.subscription.findMany({
      where: { createdBy: { id: ctx.user?.id } },
      orderBy: { createdAt: "desc" },
    });
    return subscriptions;
  }),
  count: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.subscription.count({
      where: { createdBy: { id: ctx.user?.id } },
    });
  }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      cost: z.number().positive().optional(),
      billingCycle: z.nativeEnum(BillingCycle).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subscription.update({
        where: { id: input.id },
        data: {
          name: input.name,
          cost: input.cost,
          billingCycle: input.billingCycle,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subscription.delete({
        where: { id: input.id },
      });
    }),

  getTotalMonthlyCost: protectedProcedure.query(async ({ ctx }) => {
    const subscriptions = await ctx.db.subscription.findMany({
      where: { createdBy: { id: ctx.user?.id } },
      select: { cost: true },
    });
    
    const totalCost = subscriptions.reduce((total, sub) => total + sub.cost, 0);
    return totalCost / 100;
  }),

  getUpcomingRenewals: protectedProcedure.query(async ({ ctx }) => {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    return ctx.db.subscription.findMany({
      where: {
        createdBy: { id: ctx.user?.id },
        plaidPredictedNextDate: {
          not: null,
          lte: sevenDaysFromNow,
          gte: new Date(),
        },
      },
      orderBy: { plaidPredictedNextDate: 'asc' },
      take: 5,
    });
  }),
});
