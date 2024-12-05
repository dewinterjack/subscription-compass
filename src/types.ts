import type { Subscription, SubscriptionPeriod, PaymentMethod } from "@prisma/client";

export type SubscriptionWithLatestPeriod = Omit<Subscription, 'periods'> & {
  latestPeriod: SubscriptionPeriod | null;
  paymentMethod: PaymentMethod | null;
};

export function toSubscriptionWithLatestPeriod(
  subscription: Subscription & { periods: SubscriptionPeriod[]; paymentMethod: PaymentMethod | null }
): SubscriptionWithLatestPeriod {
  const { periods, ...rest } = subscription;
  return {
    ...rest,
    latestPeriod: periods[0] ?? null,
  };
}