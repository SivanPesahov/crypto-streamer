import { pool } from "@/lib/sql/mysql";
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
      const [rows] = await pool.execute<any[]>(
        `SELECT name, symbol, image_url AS image
         FROM daily_prices
         WHERE coin_id = ?
         ORDER BY date DESC
         LIMIT 1`,
        [coinIdNorm]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        name = name ?? rows[0]?.name ?? undefined;
        symbol = symbol ?? rows[0]?.symbol ?? undefined;
        image = image ?? rows[0]?.image ?? undefined;
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
