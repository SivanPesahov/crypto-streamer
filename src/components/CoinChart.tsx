"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type Props = {
  prices: { date: string; price: number }[];
};

export default function CoinChart({ prices }: Props) {
  const formattedData = prices.map((entry, i) => ({
    day: `Day ${i + 1}`,
    value: entry.price,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Simulated Price Trend</CardTitle>
        <CardDescription>
          Visual representation of the simulated daily price fluctuations over
          the past week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="day"
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#ffffff" }}
            />
            <YAxis
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => "$" + value}
              tick={{ fill: "#ffffff" }}
            />
            <Bar dataKey="value" fill="#ffffff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
