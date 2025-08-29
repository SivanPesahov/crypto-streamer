import { CryptoCoin } from "@/types/coinType";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "./dashboardheader";
import { FilterNav } from "./filterButton";
import { FavoriteButton } from "./favoriteButton";

type Props = {
  allData: CryptoCoin[] | null;
  risers: CryptoCoin[];
  fallers: CryptoCoin[];
  isLoggedIn?: boolean;
  initialFavorites?: string[];
  filter?: string | null;
};

export default async function DashboardClient({
  allData,
  risers,
  fallers,
  isLoggedIn = false,
  initialFavorites = [],
  filter = null,
}: Props) {
  async function toggleFavorite(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user) return;

    const rawId = (session.user as any).id;
    let userId = Number(rawId);
    if (!rawId || Number.isNaN(userId)) {
      const email = session.user?.email ?? undefined;
      if (!email) return;
      const userRow = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!userRow) return;
      userId = userRow.id;
    }

    const coinId = String(formData.get("coinId") || "")
      .trim()
      .toLowerCase();
    const action = String(formData.get("action") || "");
    if (!coinId || (action !== "add" && action !== "remove")) return;

    if (action === "add") {
      await prisma.favoriteCoin.upsert({
        where: { userId_coinId: { userId, coinId } },
        update: {},
        create: { userId, coinId },
      });
    } else {
      await prisma.favoriteCoin.deleteMany({ where: { userId, coinId } });
    }

    revalidatePath("/dashboard");
  }

  const favSet = new Set((initialFavorites || []).map(String));

  let filteredData = allData;
  if (filter === "risers") filteredData = risers;
  if (filter === "fallers") filteredData = fallers;

  return (
    <div>
      <DashboardHeader />
      <FilterNav filter={filter} />
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
              {isLoggedIn && (
                <TableHead className="w-[60px] text-center text-neutral-400 font-semibold uppercase text-xs tracking-wider bg-neutral-800">
                  Fav
                </TableHead>
              )}
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
                {isLoggedIn && (
                  <TableCell className="text-center">
                    <FavoriteButton
                      coinId={coin.id}
                      isFavorite={favSet.has(coin.id)}
                      toggleFavorite={toggleFavorite}
                    />
                  </TableCell>
                )}
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
                  colSpan={isLoggedIn ? 5 : 4}
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
