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
    select: {
      id: true,
      coinId: true,
      coinName: true,
      coinSymbol: true,
      coinImage: true,
    },
  });

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
                const meta = {
                  name: coin.coinName,
                  symbol: coin.coinSymbol?.toUpperCase?.() ?? "",
                  image: coin.coinImage,
                } as const;
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
                      {meta?.name
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
