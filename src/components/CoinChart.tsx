"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Props = {
  prices: { date: string; price: number }[];
};

export default function CoinChart({ prices }: Props) {
  const formattedData = prices.map((entry, i) => ({
    day: `Day ${i + 1}`,
    value: entry.price,
  }));

  const values = prices.map((entry) => entry.price);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          7-Day Price Overview
        </CardTitle>
        <CardDescription>
          A clean visualization of the past week's closing prices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
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
              padding={{ left: 30 }}
            />
            <YAxis
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              tick={{ fill: "#ffffff" }}
              domain={[min - range * 0.1, max + range * 0.1]}
            />
            <Tooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              formatter={(value: number) => [`$${value}`, "Price"]}
              contentStyle={{
                backgroundColor: "#0a0a0a",
                border: "none",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
              dot={{ fill: "#ffffff", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
