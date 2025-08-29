import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStoredCoinHistory } from "@/services/getStoredCoinHistory";
import { SavedCoinsList } from "@/components/savedCoinsChart";

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
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Saved coins</CardTitle>
            <Link href="/dashboard" prefetch={false}>
              <Button size="sm">Back to Dashboard</Button>
            </Link>
          </div>
          <CardDescription>
            {`Welcome${
              session?.user?.name || dbUser.name
                ? `, ${session?.user?.name ?? dbUser.name}`
                : ""
            }. Your personal list will appear here.`}
          </CardDescription>
          <SavedCoinsList
            savedCoins={savedCoins}
            historyMap={historyMap}
            dbUser={dbUser}
            session={session}
          />
        </CardHeader>
      </Card>
    </div>
  );
}
