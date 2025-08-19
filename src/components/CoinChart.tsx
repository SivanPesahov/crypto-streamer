"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">
        Simulated Price Chart (7 Days)
      </h2>
      <Bar
        data={{
          labels: priceChanges.map((entry) => entry.day),
          datasets: [
            {
              label: "Price ($)",
              data: priceChanges.map((entry) => entry.value.toFixed(2)),
              backgroundColor: "rgba(99, 102, 241, 0.5)",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" as const },
          },
        }}
      />
    </div>
  );
}
