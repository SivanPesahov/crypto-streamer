import Link from "next/link";
import SavedCoinSparkline from "./savedCoinSparkline";

export function SavedCoinsList({
  savedCoins,
  historyMap,
  dbUser,
  session,
}: {
  savedCoins: {
    id: number;
    coinId: string;
    coinName: string | null;
    coinSymbol: string | null;
    coinImage: string | null;
  }[];
  historyMap: Record<string, { date: string; price: number }[]>;
  dbUser: { name: string | null };
  session: { user?: { name?: string | null } } | null;
}) {
  return (
    <ul className="mt-4 divide-y divide-white/10">
      {savedCoins.length === 0 ? (
        <li className="text-sm text-muted-foreground">No saved coins yet.</li>
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
              <Link
                href={`/dashboard/${coin.coinName?.toLocaleLowerCase()}`}
                className="flex items-center gap-2 w-full"
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
              </Link>
            </li>
          );
        })
      )}
    </ul>
  );
}
