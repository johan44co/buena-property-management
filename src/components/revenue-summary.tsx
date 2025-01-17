"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const chartData: {
  month: string;
  total: number;
}[] = [
  { month: "January", total: 0 },
  { month: "February", total: 0 },
  { month: "March", total: 0 },
  { month: "April", total: 0 },
  { month: "May", total: 0 },
  { month: "June", total: 0 },
  { month: "July", total: 0 },
  { month: "August", total: 0 },
  { month: "September", total: 0 },
  { month: "October", total: 0 },
  { month: "November", total: 0 },
  { month: "December", total: 0 },
];

const chartConfig = {
  total: {
    label: "Total",
  },
} satisfies ChartConfig;

export function RevenueSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Summary of the revenue generated per month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
