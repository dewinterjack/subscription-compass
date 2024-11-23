import type { Subscription, SubscriptionPeriod } from "@prisma/client";

export type SubscriptionWithLatestPeriod = Omit<Subscription, 'periods'> & {
  latestPeriod: SubscriptionPeriod | null;
};

export function toSubscriptionWithLatestPeriod(
  subscription: Subscription & { periods: SubscriptionPeriod[] }
): SubscriptionWithLatestPeriod {
  const { periods, ...rest } = subscription;
  return {
    ...rest,
    latestPeriod: periods[0] ?? null,
  };
}