import { prisma } from "../../lib/sql/prisma";

export async function getStoredCoinHistory(coinId: string) {
  const rows = await prisma.daily_prices.findMany({
    where: { coin_id: coinId },
    select: { date: true, price_usd: true },
    orderBy: { date: "asc" },
  });

  console.log(`Retrieved ${rows.length} rows from Prisma for ${coinId}`);

  if (Array.isArray(rows) && rows.length > 0) {
    const history = rows.map((row: any) => {
      const dateStr =
        row.date instanceof Date
          ? row.date.toISOString().slice(0, 10)
          : String(row.date);
      const priceNum =
        row.price_usd && typeof row.price_usd.toNumber === "function"
          ? row.price_usd.toNumber()
          : Number(row.price_usd);
      return { date: dateStr, price: priceNum };
    });
    return history;
  }

  throw new Error(`No historical data found for ${coinId}`);
}
