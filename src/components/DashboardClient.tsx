"use client";

import { CryptoCoin } from "@/types/coinType";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FilterButton } from "./filterButton";

type Props = {
  allData: CryptoCoin[] | null;
  risers: CryptoCoin[];
  fallers: CryptoCoin[];
};

export default function DashboardClient({ allData, risers, fallers }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filter = searchParams.get("filter");

  let filteredData = allData;
  if (filter === "risers") filteredData = risers;
  if (filter === "fallers") filteredData = fallers;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crypto Dashboard</h1>
      <div className="flex gap-4 mb-4">
        <FilterButton
          label="All"
          filterValue={null}
          currentFilter={filter}
          onClick={() => router.push("/dashboard")}
          colorClass="bg-gray-300"
        />
        <FilterButton
          label="Top Risers"
          filterValue="risers"
          currentFilter={filter}
          onClick={() => router.push("/dashboard?filter=risers")}
          colorClass="bg-green-300"
        />
        <FilterButton
          label="Top Fallers"
          filterValue="fallers"
          currentFilter={filter}
          onClick={() => router.push("/dashboard?filter=fallers")}
          colorClass="bg-red-300"
        />
      </div>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Symbol</th>
            <th className="border px-4 py-2 text-right">Price</th>
            <th className="border px-4 py-2 text-right">% 24h</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((coin) => (
            <tr key={coin.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                <Link href={`/dashboard/${coin.id}`}>{coin.name}</Link>
              </td>
              <td className="border px-4 py-2 uppercase">{coin.symbol}</td>
              <td className="border px-4 py-2 text-right">
                ${coin.current_price.toLocaleString()}
              </td>
              <td
                className={`border px-4 py-2 text-right ${
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
