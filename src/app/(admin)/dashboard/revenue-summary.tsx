"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", total: 266 },
  { month: "February", total: 505 },
  { month: "March", total: 357 },
  { month: "April", total: 263 },
  { month: "May", total: 339 },
  { month: "June", total: 354 },
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
  );
}
