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
  current_price: number;
  price_change_percentage_24h: number;
};

export default function CoinChart({
  current_price,
  price_change_percentage_24h,
}: Props) {
  const priceChanges = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: current_price * (1 + price_change_percentage_24h / 100) ** (i - 6),
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
            data={priceChanges}
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
