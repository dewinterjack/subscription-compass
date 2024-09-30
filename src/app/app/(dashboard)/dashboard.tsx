import { AlertCircle, CreditCard, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SubscriptionsSection } from "./subscriptions";
import { api } from "@/trpc/react";
import { CURRENCY_SYMBOL } from "@/lib/constants";

export default function Dashboard() {
  const {
    data: subscriptions,
    isLoading,
    isError,
  } = api.subscription.getAll.useQuery();

  const totalMonthlyCost =
    subscriptions?.reduce((total, sub) => total + sub.cost, 0) ?? 0;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading subscriptions.</div>;

  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(550px,1fr))] xl:grid-cols-[2fr,1fr]">
          <div className="w-full space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Subscriptions</CardDescription>
                  <CardTitle className="text-4xl">
                    {subscriptions?.length ?? 0}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +2 new this month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Monthly Spend</CardDescription>
                  <CardTitle className="text-4xl">
                    {CURRENCY_SYMBOL}
                    {totalMonthlyCost.toFixed(2)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    -$50 from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={65} aria-label="65% of budget" />
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Potential Savings</CardDescription>
                  <CardTitle className="text-4xl">
                    {CURRENCY_SYMBOL}75
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Based on 3 recommendations
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Placeholder</CardDescription>
                  <CardTitle className="text-4xl">3</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Next 7 days
                  </div>
                </CardContent>
              </Card>
            </div>
            <SubscriptionsSection />
          </div>

          <div className="w-full space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Renewals</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptions?.slice(0, 3).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{sub.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Renews in 30 days
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {CURRENCY_SYMBOL}
                      {sub.cost.toFixed(2)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Savings Opportunities</CardTitle>
                <CardDescription>Optimize your subscriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Switch to Annual Plan",
                    description: "Save $24/year on Spotify",
                    action: "Apply",
                  },
                  {
                    title: "Student Discount Available",
                    description: "Save 50% on Adobe CC",
                    action: "Verify",
                  },
                  {
                    title: "Bundle Opportunity",
                    description: "Save $5/month on streaming",
                    action: "View",
                  },
                ].map((opportunity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{opportunity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {opportunity.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast.info("This feature is not yet implemented.")
                      }
                    >
                      {opportunity.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>
                  Stay informed about your subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Price Increase",
                    description: "Netflix raising prices next month",
                    action: "Review",
                  },
                  {
                    title: "Trial Ending Soon",
                    description: "3 days left on your Audible trial",
                    action: "Manage",
                  },
                ].map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast.info("This feature is not yet implemented.")
                      }
                    >
                      {alert.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
