"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export type SparklinePoint = { date: string; price: number };

export default function SavedCoinSparkline({
  prices,
  height = 56,
}: {
  prices: SparklinePoint[];
  height?: number;
}) {
  const data = (prices ?? []).map((p, i) => ({
    x: i + 1,
    y: Number(p.price) || 0,
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 4, bottom: 0, left: 4, right: 4 }}
        >
          <XAxis dataKey="x" hide />
          <YAxis dataKey="y" hide domain={["dataMin", "dataMax"]} />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.25)", strokeWidth: 1 }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            labelFormatter={() => ""}
            contentStyle={{
              background: "#0a0a0a",
              border: "none",
              color: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="currentColor"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
