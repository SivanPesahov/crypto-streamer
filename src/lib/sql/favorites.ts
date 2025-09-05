import { prisma as defaultPrisma } from "@/lib/sql/prisma";

export type FavoriteMeta = {
  name?: string;
  symbol?: string;
  image?: string;
};

export async function upsertFavoriteWithMeta(
  userId: number,
  coinId: string,
  meta: FavoriteMeta = {},
  prisma = defaultPrisma
) {
  const coinIdNorm = String(coinId).trim().toLowerCase();
  let name = meta.name?.trim();
  let symbol = meta.symbol?.trim();
  let image = meta.image?.trim();

  if (!name || !symbol || !image) {
    try {
      const latest = await prisma.daily_prices.findFirst({
        where: { coin_id: coinIdNorm },
        select: { name: true, symbol: true, image_url: true },
        orderBy: { date: "desc" },
      });
      if (latest) {
        name = name ?? latest.name ?? undefined;
        symbol = symbol ?? latest.symbol ?? undefined;
        image = image ?? latest.image_url ?? undefined;
      }
    } catch {}
  }

  if (symbol) symbol = symbol.toUpperCase();

  return prisma.favoriteCoin.upsert({
    where: { userId_coinId: { userId, coinId: coinIdNorm } },
    update: {
      coinName: name ?? undefined,
      coinSymbol: symbol ?? undefined,
      coinImage: image ?? undefined,
    },
    create: {
      userId,
      coinId: coinIdNorm,
      coinName: name ?? null,
      coinSymbol: symbol ?? null,
      coinImage: image ?? null,
    },
  });
}
