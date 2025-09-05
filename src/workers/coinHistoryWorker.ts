import { getCoinHistory } from "../lib/coin-gecko/getCoinHistory";
import { prisma } from "../lib/sql/prisma";
import { connectRabbitMQ } from "../lib/rabbitmq/rabbitmq";

async function startWorker() {
  const { connection, channel } = await connectRabbitMQ();
  const QUEUE_NAME = "coin-history-request";
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.prefetch(1);
  console.log(`👷 Listening on queue "${QUEUE_NAME}"`);

  channel.consume(
    QUEUE_NAME,
    async (msg) => {
      if (!msg) return;
      try {
        const { coinId, name, symbol, image } = JSON.parse(
          msg.content.toString()
        );
        console.log(`📡 Fetching history for: ${coinId}`);
        console.log("📩 Message payload:", { coinId, name, symbol, image });
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

        const groupedByDate = new Map<string, [number, number][]>();
        for (const [timestamp, price] of history) {
          const date = new Date(timestamp).toISOString().split("T")[0];
          if (!groupedByDate.has(date)) groupedByDate.set(date, []);
          groupedByDate.get(date)!.push([timestamp, price]);
        }
        const dates = Array.from(groupedByDate.keys()).sort();
        const last7Dates = dates.slice(-7);
        const symbolValue =
          symbol?.toUpperCase() ?? coinId.slice(0, 4).toUpperCase();
        const nameValue = name ?? coinId;
        const imageValue = image ?? null;

        const rows = last7Dates.map((date) => {
          const [timestamp, price] = groupedByDate.get(date)![0];
          return {
            coin_id: coinId,
            symbol: symbolValue,
            name: nameValue,
            image_url: imageValue,
            price_usd: price,
            date: new Date(date),
          };
        });

        await prisma.$transaction([
          prisma.daily_prices.deleteMany({ where: { coin_id: coinId } }),
          prisma.daily_prices.createMany({ data: rows }),
        ]);

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
