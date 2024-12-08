"use client";

import { AlertCircle, CreditCard, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import { differenceInDays, startOfDay } from "date-fns";
import LoadingDots from "@/components/icons/loading-dots";
import { SubscriptionsSection } from "./subscriptions";

export default function Dashboard() {
  const {
    data: upcomingRenewals,
    isLoading,
    isError,
  } = api.subscription.getUpcomingRenewals.useQuery();

  const { data: subscriptionCount, isLoading: isSubscriptionCountLoading } =
    api.subscription.count.useQuery();

  const { data: totalMonthlyCost = 0 } =
    api.subscription.getTotalMonthlyCost.useQuery();

  const { data: endingTrials } = api.subscription.getEndingTrials.useQuery();

  const { data: newThisMonth = 0 } = api.subscription.getNewThisMonth.useQuery();

  const getRenewalText = (date: Date) => {
    const days = differenceInDays(startOfDay(date), startOfDay(new Date()));
    if (days === 0) return "Today";
    return `in ${days} ${days === 1 ? "day" : "days"}`;
  };

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingDots />
      </div>
    );
  if (isError) return <div>Error loading subscriptions.</div>;

  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-2 sm:p-4">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] xl:grid-cols-[2fr,1fr]">
          <div className="flex w-full flex-col space-y-4">
            <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3">
              <Card className="min-w-[200px]">
                {isSubscriptionCountLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <LoadingDots />
                  </div>
                ) : (
                  <>
                    <CardHeader className="pb-2 p-4 sm:p-6">
                      <CardDescription>Total Subscriptions</CardDescription>
                      <CardTitle className="text-2xl sm:text-4xl">
                        {subscriptionCount}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        +{newThisMonth} new this month
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
              <Card className="min-w-[200px]">
                <CardHeader className="pb-2 p-4 sm:p-6">
                  <CardDescription>Monthly Spend</CardDescription>
                  <CardTitle className="text-2xl sm:text-4xl">
                    {CURRENCY_SYMBOL}
                    {(totalMonthlyCost / 100).toFixed(2)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    -$50 from last month
                  </div>
                </CardContent>
              </Card>
              <Card className="min-w-[200px]">
                <CardHeader className="pb-2 p-4 sm:p-6">
                  <CardDescription>Yearly Spend</CardDescription>
                  <CardTitle className="text-2xl sm:text-4xl">
                    {CURRENCY_SYMBOL}
                    {((totalMonthlyCost * 12) / 100).toFixed(2)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Projected based on current spend
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="w-full space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle>Upcoming Renewals</CardTitle>
                    <CardDescription>Next 7 days</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      toast.info("View all renewals not yet implemented")
                    }
                  >
                    View More
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                {upcomingRenewals?.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
                        <CreditCard className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-medium">{sub.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Renews {getRenewalText(sub.latestPeriod.periodEnd)}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {CURRENCY_SYMBOL}
                      {(Number(sub.latestPeriod?.price ?? 0) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
                {upcomingRenewals?.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No upcoming renewals
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle>Alerts</CardTitle>
                <CardDescription>
                  Stay informed about your subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                {endingTrials?.map((trial) => (
                  <div
                    key={trial.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-yellow-100 flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Trial Ending Soon</p>
                        <p className="text-sm text-muted-foreground">
                          {trial.name} trial ends{" "}
                          {getRenewalText(trial.endDate!)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast.info("Trial management not yet implemented.")
                      }
                    >
                      Manage
                    </Button>
                  </div>
                ))}
                {endingTrials?.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No active alerts
                  </p>
                )}
              </CardContent>
            </Card>
            <SubscriptionsSection />
          </div>
        </div>
      </main>
    </div>
  );
}
