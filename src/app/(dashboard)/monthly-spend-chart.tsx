"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LoadingDots from "@/components/icons/loading-dots";

export function MonthlySpendChart() {
  const { data: monthlySpend, isLoading } = api.subscription.getMonthlySpend.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <LoadingDots />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlySpend}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${CURRENCY_SYMBOL}${(value / 100).toFixed(0)}`}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              {/* TODO: Fix this type error */}
              {/* <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Month
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0]?.payload?.month}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Spend
                          </span>
                          <span className="font-bold">
                            {CURRENCY_SYMBOL}
                            {(payload[0]?.value / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              /> */}
              <Area
                type="monotone"
                dataKey="spend"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#spend)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 