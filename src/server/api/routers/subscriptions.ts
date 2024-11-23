import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { BillingCycle } from "@prisma/client";
import { addDays } from "date-fns";

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
        ? input.endDate
        : addDays(input.startDate, BILLING_CYCLE_DAYS[input.billingCycle]);

      return ctx.db.$transaction(async (tx) => {
        const subscription = await tx.subscription.create({
          data: {
            name: input.name,
            autoRenew: input.autoRenew,
            billingCycle: input.billingCycle,
            startDate: input.startDate,
            endDate: input.isTrial ? input.endDate : undefined,
            createdBy: { connect: { id: ctx.user?.id } },
          },
        });

        await tx.subscriptionPeriod.create({
          data: {
            subscriptionId: subscription.id,
            price: input.price,
            isTrial: input.isTrial,
            periodStart: input.startDate,
            periodEnd,
          },
        });

        return subscription;
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
});