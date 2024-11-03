"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { api } from "@/trpc/react"
import LoadingDots from "./icons/loading-dots"

// This type matches the structure of the data returned by your function
type SubscriptionData = {
  category: string
  count: number
  total: number
}

// This would typically come from your API call

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function SubscriptionPieChart() {
  const { data: categories, isLoading } = api.subscription.getByCategory.useQuery();


  const totalSpent = useMemo(() => {
    return categories?.reduce((acc, curr) => acc + curr.total, 0) || 0
  }, [])

  const chartConfig = categories?.reduce((acc, { category }) => {
    acc[category] = {
      label: category.toLowerCase().replace(/_/g, ' '),
      color: COLORS[Object.keys(acc).length % COLORS.length],
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>)

  if(isLoading) {
    return (
    <div className="flex h-full items-center justify-center">
    <LoadingDots />
  </div>)
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Subscription Spending by Category</CardTitle>
        <CardDescription>Total spent: ${totalSpent.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}