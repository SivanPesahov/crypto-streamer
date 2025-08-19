import React from "react";
import { getRealtimeData } from "@/lib/getRealtimeData";
import { CryptoCoin } from "@/types/coinType";

export default async function DashboardPage() {
  const realtimeData = await getRealtimeData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Crypto Dashboard - Realtime Data
      </h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border-b text-black">Name</th>
            <th className="py-2 px-4 border-b text-black">Symbol</th>
            <th className="py-2 px-4 border-b text-black">Current Price ($)</th>
            <th className="py-2 px-4 border-b text-black">% Change (24h)</th>
          </tr>
        </thead>
        <tbody>
          {realtimeData?.map((coin: CryptoCoin) => (
            <tr key={coin.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-black">{coin.name}</td>
              <td className="py-2 px-4 border-b text-black">
                {coin.symbol.toUpperCase()}
              </td>
              <td className="py-2 px-4 border-b text-black">
                ${coin.current_price.toFixed(2)}
              </td>
              <td
                className={`py-2 px-4 border-b text-black ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
