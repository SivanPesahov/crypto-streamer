import { pool } from "./mysql";

export async function getStoredCoinHistory(coinId: string) {
  const [rows] = await pool.execute<any[]>(
    `SELECT date, price_usd FROM daily_prices WHERE coin_id = ? ORDER BY date ASC`,
    [coinId]
  );

  console.log(`Retrieved ${rows.length} rows from MySQL for ${coinId}`);
  if (Array.isArray(rows) && rows.length > 0) {
    const history = rows.map((row: any) => ({
      date: row.date,
      price: row.price_usd,
    }));

    return history;
  }

  throw new Error(`No historical data found for ${coinId}`);
}
