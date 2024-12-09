import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { BillingCycle } from "@prisma/client";
import { addDays, endOfDay, startOfDay, startOfMonth } from "date-fns";
import { toSubscriptionWithLatestPeriod, type SubscriptionWithLatestPeriod } from "@/types";
import type { SubscriptionPeriod } from "@prisma/client";

const BILLING_CYCLE_DAYS: Record<BillingCycle, number> = {
  Weekly: 7,
  Biweekly: 14,
  Monthly: 30,
  Yearly: 365,
  Unknown: 30,
};

const baseSubscriptionSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  billingCycle: z.nativeEnum(BillingCycle),
  autoRenew: z.boolean().default(true),
  startDate: z.date(),
  paymentMethodId: z.string().nullable(),
});

export const subscriptionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.discriminatedUnion('isTrial', [
      baseSubscriptionSchema.extend({
        isTrial: z.literal(true),
        endDate: z.date(),
      }),
      baseSubscriptionSchema.extend({
        isTrial: z.literal(false),
      })
    ]))
    .mutation(async ({ ctx, input }) => {
      const periodEnd = input.isTrial 
        ? endOfDay(input.endDate)
        : endOfDay(addDays(input.startDate, BILLING_CYCLE_DAYS[input.billingCycle]));

      return ctx.db.$transaction(async (tx) => {
        const subscription = await tx.subscription.create({
          data: {
            name: input.name,
            autoRenew: input.autoRenew,
            billingCycle: input.billingCycle,
            startDate: startOfDay(input.startDate),
            endDate: input.isTrial ? startOfDay(input.endDate) : undefined,
            createdBy: { connect: { id: ctx.user?.id } },
            periods: {
              create: {
                price: input.price,
                isTrial: input.isTrial,
                periodStart: startOfDay(input.startDate),
                periodEnd: endOfDay(periodEnd),
              }
            },
            paymentMethod: input.paymentMethodId ? { connect: { id: input.paymentMethodId } } : undefined,
          },
          include: {
            periods: {
              orderBy: { periodEnd: 'desc' },
              take: 1,
            },
            paymentMethod: true,
          }
        });

        return toSubscriptionWithLatestPeriod(subscription);
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const subscriptions = await ctx.db.subscription.findMany({
      where: { createdBy: { id: ctx.user?.id } },
      orderBy: { createdAt: "desc" },
      include: {
        periods: {
          orderBy: { periodEnd: 'desc' },
          take: 1,
        },
        paymentMethod: true,
      },
    });
    return subscriptions
      .map(toSubscriptionWithLatestPeriod)
      .filter((sub): sub is SubscriptionWithLatestPeriod & { latestPeriod: SubscriptionPeriod } => 
        sub.latestPeriod !== null
      );
  }),
  count: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.subscription.count({
      where: { createdBy: { id: ctx.user?.id } },
    });
  }),
  getUpcomingRenewals: protectedProcedure.query(async ({ ctx }) => {
    const today = startOfDay(new Date());
    const nextWeek = endOfDay(addDays(today, 7));

    const subscriptions = await ctx.db.subscription.findMany({
      where: {
        createdById: ctx.user?.id,
        autoRenew: true,
        endDate: null,
        periods: {
          some: {
            periodEnd: {
              gte: today,
              lte: nextWeek,
            },
            isTrial: false,
          }
        }
      },
      include: {
        periods: {
          orderBy: { periodEnd: 'desc' },
          take: 1,
          where: {
            periodEnd: {
              gte: today,
              lte: nextWeek,
            },
            isTrial: false,
          },
        },
        paymentMethod: true,
      },
    });

    return subscriptions
      .map(toSubscriptionWithLatestPeriod)
      .filter((sub): sub is SubscriptionWithLatestPeriod & { latestPeriod: SubscriptionPeriod } => 
        sub.latestPeriod !== null
      );
  }),
  getEndingTrials: protectedProcedure.query(async ({ ctx }) => {
    const today = startOfDay(new Date());
    const nextWeek = endOfDay(addDays(today, 7));

    return ctx.db.subscription.findMany({
      where: {
        createdById: ctx.user?.id,
        endDate: {
          gte: today,
          lte: nextWeek,
        },
        periods: {
          some: {
            isTrial: true,
          }
        },
      },
      include: {
        periods: {
          where: {
            isTrial: true,
          },
        },
      },
      orderBy: {
        endDate: 'asc',
      },
    });
  }),
  getTotalMonthlyCost: protectedProcedure
    .input(z.object({
      includeLastMonthDiff: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const today = new Date();
      const startOfLastMonth = startOfMonth(new Date(today.getFullYear(), today.getMonth() - 1));
      const endOfLastMonth = endOfDay(new Date(today.getFullYear(), today.getMonth(), 0));

      // Get current month's cost calculation
      const activeSubscriptions = await ctx.db.subscription.findMany({
        where: {
          createdById: ctx.user?.id,
          OR: [
            { endDate: null },
            { endDate: { gt: today } }
          ],
        },
        include: {
          periods: {
            where: {
              isTrial: false,
            },
            orderBy: {
              periodEnd: 'desc',
            },
            take: 1,
          },
          paymentMethod: true,
        },
      });

      const subscriptionsWithPeriod = activeSubscriptions
        .map(toSubscriptionWithLatestPeriod)
        .filter((sub): sub is SubscriptionWithLatestPeriod & { latestPeriod: SubscriptionPeriod } => 
          sub.latestPeriod !== null
        );

      const currentMonthCost = subscriptionsWithPeriod.reduce((sum, subscription) => {
        const period = subscription.latestPeriod;
        const pricePerMonth = period.price * (30 / BILLING_CYCLE_DAYS[subscription.billingCycle]);
        return sum + pricePerMonth;
      }, 0);

      if (!input.includeLastMonthDiff) {
        return currentMonthCost;
      }

      // Get last month's subscriptions and calculate cost
      const lastMonthPeriods = await ctx.db.subscriptionPeriod.findMany({
        where: {
          subscription: {
            createdById: ctx.user?.id,
          },
          isTrial: false,
          periodStart: {
            lte: endOfLastMonth,
          },
          periodEnd: {
            gte: startOfLastMonth,
          },
        },
        include: {
          subscription: true,
        },
      });

      const lastMonthCost = lastMonthPeriods.reduce((sum, period) => {
        const daysInPeriod = Math.ceil((period.periodEnd.getTime() - period.periodStart.getTime()) / (1000 * 60 * 60 * 24));
        const dailyRate = period.price / daysInPeriod;
        const daysInMonth = new Date(startOfLastMonth.getFullYear(), startOfLastMonth.getMonth() + 1, 0).getDate();
        return sum + (dailyRate * daysInMonth);
      }, 0);

      return {
        currentAmount: currentMonthCost,
        lastMonthDiff: currentMonthCost - lastMonthCost,
      };
    }),
  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const subscription = await tx.subscription.findFirst({
          where: {
            id: input.id,
            createdById: ctx.user?.id,
          },
        });

        if (!subscription) {
          throw new Error("Subscription not found or unauthorized");
        }

        return tx.subscription.delete({
          where: {
            id: input.id,
          },
        });
      });
    }),
  update: protectedProcedure
    .input(z.discriminatedUnion('isTrial', [
      baseSubscriptionSchema.extend({
        id: z.string(),
        isTrial: z.literal(true),
        endDate: z.date(),
      }),
      baseSubscriptionSchema.extend({
        id: z.string(),
        isTrial: z.literal(false),
      })
    ]))
    .mutation(async ({ ctx, input }) => {
      const periodEnd = input.isTrial 
        ? input.endDate
        : addDays(input.startDate, BILLING_CYCLE_DAYS[input.billingCycle]);

      return ctx.db.$transaction(async (tx) => {
        const latestPeriod = await tx.subscriptionPeriod.findFirst({
          where: { subscriptionId: input.id },
          orderBy: { periodEnd: 'desc' }
        });

        if (!latestPeriod) {
          throw new Error("No period found for subscription");
        }

        const subscription = await tx.subscription.update({
          where: {
            id: input.id,
            createdById: ctx.user?.id,
          },
          data: {
            name: input.name,
            autoRenew: input.autoRenew,
            billingCycle: input.billingCycle,
            startDate: startOfDay(input.startDate),
            endDate: input.isTrial ? endOfDay(input.endDate) : null,
            paymentMethod: input.paymentMethodId 
              ? { connect: { id: input.paymentMethodId } }
              : { disconnect: true },
            periods: {
              update: {
                where: { id: latestPeriod.id },
                data: {
                  price: input.price,
                  isTrial: input.isTrial,
                  periodStart: startOfDay(input.startDate),
                  periodEnd: endOfDay(periodEnd),
                }
              }
            }
          },
          include: {
            periods: {
              orderBy: { periodEnd: 'desc' },
              take: 1,
            },
            paymentMethod: true,
          }
        });

        return toSubscriptionWithLatestPeriod(subscription);
      });
    }),
  getNewThisMonth: protectedProcedure.query(async ({ ctx }) => {
    const startOfThisMonth = startOfMonth(new Date());
    
    return ctx.db.subscription.count({
      where: {
        createdById: ctx.user?.id,
        createdAt: {
          gte: startOfThisMonth,
        },
      },
    });
  }),
  getMonthlySpend: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const twelveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 11, 1);

    const subscriptionPeriods = await ctx.db.subscriptionPeriod.findMany({
      where: {
        subscription: {
          createdById: ctx.user?.id,
        },
        isTrial: false,
        periodStart: {
          gte: twelveMonthsAgo,
        },
      },
      include: {
        subscription: true,
      },
      orderBy: {
        periodStart: 'asc',
      },
    });

    const monthlySpend: { month: string; spend: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      const spend = subscriptionPeriods
        .filter(period => {
          const periodMonth = period.periodStart.getMonth();
          const periodYear = period.periodStart.getFullYear();
          return periodMonth === date.getMonth() && periodYear === date.getFullYear();
        })
        .reduce((total, period) => {
          const daysInPeriod = Math.ceil((period.periodEnd.getTime() - period.periodStart.getTime()) / (1000 * 60 * 60 * 24));
          const dailyRate = period.price / daysInPeriod;
          const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
          return total + (dailyRate * daysInMonth);
        }, 0);

      monthlySpend.unshift({ month, spend });
    }

    return monthlySpend;
  }),
});