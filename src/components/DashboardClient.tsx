"use client";

import { CryptoCoin } from "@/types/coinType";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FilterButton } from "./filterButton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div>
      <div className="border-b border-neutral-800 mb-6 pb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-center text-neutral-100">
          Crypto Market Dashboard
        </h1>
      </div>
      <div className="flex justify-center gap-4 mb-8">
        <FilterButton
          label="All"
          filterValue={null}
          currentFilter={filter}
          onClick={() => router.push("/dashboard")}
          colorClass="bg-neutral-700 hover:bg-neutral-600 text-white"
        />
        <FilterButton
          label="Top Risers"
          filterValue="risers"
          currentFilter={filter}
          onClick={() => router.push("/dashboard?filter=risers")}
          colorClass="bg-neutral-700 hover:bg-neutral-600 text-white"
        />
        <FilterButton
          label="Top Fallers"
          filterValue="fallers"
          currentFilter={filter}
          onClick={() => router.push("/dashboard?filter=fallers")}
          colorClass="bg-neutral-700 hover:bg-neutral-600 text-white"
        />
      </div>
      <div className="rounded-2xl border border-neutral-800 shadow-md bg-neutral-950">
        <Table>
          <TableCaption>
            {filter === "risers"
              ? "Top Rising Coins"
              : filter === "fallers"
              ? "Top Falling Coins"
              : "All Crypto Market Data"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-neutral-400 font-semibold uppercase text-xs tracking-wider bg-neutral-800">
                Name
              </TableHead>
              <TableHead className="text-neutral-400 font-semibold uppercase text-xs tracking-wider bg-neutral-800">
                Symbol
              </TableHead>
              <TableHead className="text-right text-neutral-400 font-semibold uppercase text-xs tracking-wider bg-neutral-800">
                Price
              </TableHead>
              <TableHead className="text-right text-neutral-400 font-semibold uppercase text-xs tracking-wider bg-neutral-800">
                % 24h
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.map((coin) => (
              <TableRow
                key={coin.id}
                className="odd:bg-neutral-900 even:bg-neutral-950 hover:bg-neutral-800 hover:shadow-inner transition-colors duration-200"
              >
                <TableCell className="text-sm font-semibold text-neutral-200 hover:underline">
                  <Link href={`/dashboard/${coin.id}`}>{coin.name}</Link>
                </TableCell>
                <TableCell className="text-sm uppercase text-neutral-400">
                  {coin.symbol}
                </TableCell>
                <TableCell className="text-sm text-right font-mono text-neutral-200">
                  ${coin.current_price.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      coin.price_change_percentage_24h >= 0
                        ? "bg-green-900 text-green-300"
                        : "bg-red-900 text-red-300"
                    }`}
                  >
                    {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {filteredData?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-sm text-center py-10 text-neutral-500 italic"
                >
                  🚫 No coins found for this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
