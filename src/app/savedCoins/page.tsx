import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import SavedCoinSparkline from "@/components/savedCoinChart";
import { getStoredCoinHistory } from "@/services/getStoredCoinHistory";

export const metadata = {
  title: "Saved Coins",
};

export default async function SavedCoinsPage() {
  const session = await auth();

  const email = session?.user?.email;
  if (!email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (!dbUser) {
    redirect("/login");
  }

  const savedCoins = await prisma.favoriteCoin.findMany({
    where: { userId: dbUser.id },
  });
  const ids = savedCoins.map((c) => c.coinId).filter(Boolean);
  let nameMap: Record<
    string,
    { name: string; symbol?: string; image?: string; price?: number }
  > = {};
  if (ids.length) {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&ids=${encodeURIComponent(
        ids.join(",")
      )}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (res.ok) {
        const data = (await res.json()) as any[];
        nameMap = Object.fromEntries(
          data.map((d: any) => [
            d.id,
            {
              name: d.name,
              symbol: d.symbol?.toUpperCase?.(),
              image: d.image,
              price: d.current_price,
            },
          ])
        );
      }
    } catch (e) {}
  }
  const historyEntries = await Promise.all(
    savedCoins.map(async (c) => {
      try {
        const hist = await getStoredCoinHistory(c.coinId);
        return [c.coinId, hist] as const;
      } catch {
        return [c.coinId, []] as const;
      }
    })
  );
  const historyMap: Record<string, { date: string; price: number }[]> =
    Object.fromEntries(historyEntries);
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="border border-white/10 bg-background/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Saved coins</CardTitle>
          <CardDescription>
            {`Welcome${
              session?.user?.name || dbUser.name
                ? `, ${session?.user?.name ?? dbUser.name}`
                : ""
            }. Your personal list will appear here.`}
          </CardDescription>
          <ul className="mt-4 divide-y divide-white/10">
            {savedCoins.length === 0 ? (
              <li className="text-sm text-muted-foreground">
                No saved coins yet.
              </li>
            ) : (
              savedCoins.map((coin) => {
                const meta = nameMap[coin.coinId];
                return (
                  <li
                    key={coin.id}
                    className="text-sm flex items-center gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    {meta?.image ? (
                      <img
                        src={meta.image}
                        alt={meta?.name ?? coin.coinId}
                        className="h-5 w-5 rounded-full"
                      />
                    ) : null}
                    <span>
                      {meta
                        ? `${meta.name} (${meta.symbol ?? ""})`
                        : coin.coinId}
                    </span>
                    <div className="ml-auto w-full max-w-[240px]">
                      <SavedCoinSparkline
                        prices={historyMap[coin.coinId] ?? []}
                        height={56}
                      />
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </CardHeader>
      </Card>
    </div>
  );
}
