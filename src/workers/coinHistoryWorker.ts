import { getCoinHistory } from "../services/getCoinHistory";
import { pool } from "../lib/mysql";
import { connectRabbitMQ } from "../lib/rabbitmq";

async function startWorker() {
  const { connection, channel } = await connectRabbitMQ();
  const QUEUE_NAME = "coin-history-request";
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  console.log(`👷 Listening on queue "${QUEUE_NAME}"`);

  channel.consume(
    QUEUE_NAME,
    async (msg) => {
      if (!msg) return;
      try {
        const { coinId } = JSON.parse(msg.content.toString());
        console.log(`📡 Fetching history for: ${coinId}`);
        const history: Array<[number, number]> = await getCoinHistory(
          coinId,
          7
        );
        if (!history || history.length === 0) {
          console.warn(`⚠️ No history returned for ${coinId}`);
          channel.ack(msg);
          return;
        }
        console.log(`📦 Got ${history.length} entries for: ${coinId}`);
        console.log("📦 Raw history from API:", history);

        const today = new Date();
        const connection = await pool.getConnection();

        await connection.execute(
          `DELETE FROM daily_prices WHERE coin_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
          [coinId]
        );

        const groupedByDate = new Map<string, [number, number][]>();
        for (const [timestamp, price] of history) {
          const date = new Date(timestamp).toISOString().split("T")[0];
          if (!groupedByDate.has(date)) {
            groupedByDate.set(date, []);
          }
          groupedByDate.get(date)!.push([timestamp, price]);
        }
        for (const [date, entries] of groupedByDate) {
          const [timestamp, price] = entries[0];
          console.log(`📥 Inserting for ${coinId} on ${date}: $${price}`);
          await connection.execute(
            `INSERT INTO daily_prices (coin_id, symbol, name, price_usd, date)
             VALUES (?, ?, ?, ?, ?)`,
            [coinId, coinId.slice(0, 4), coinId, price, date]
          );
        }
        connection.release();

        console.log(`✅ Saved history for ${coinId}`);
        channel.ack(msg);
      } catch (err: any) {
        console.error("❌ Error processing coin history:", err);
        if (err.response?.status === 429) {
          console.warn(`⏳ Rate limit hit, requeueing...`);
          channel.nack(msg, false, true);
        } else {
          channel.nack(msg, false, false);
        }
      }
    },
    { noAck: false }
  );
}

startWorker().catch(console.error);
