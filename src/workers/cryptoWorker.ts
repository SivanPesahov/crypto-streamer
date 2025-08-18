import { connectRabbitMQ } from "../lib/rabbitmq";
import { connectRedis, redis } from "../lib/redis";

async function startWorker() {
  await connectRedis();
  const { connection, channel } = await connectRabbitMQ();
  const queue = "crypto-data";

  await channel.assertQueue(queue, { durable: false });

  console.log(`👷 Worker listening on queue "${queue}"...`);

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const content = msg.content.toString();
      const coins = JSON.parse(content);

      coins.forEach(async (coin: any) => {
        const drop = coin.price_change_percentage_24h;

        if (drop < -5) {
          console.log(
            `🔻 ${coin.name} (${coin.symbol.toUpperCase()}): ${drop.toFixed(
              2
            )}%`
          );

          const redisKey = `drop:${coin.id}`;

          await redis.set(
            redisKey,
            JSON.stringify({
              name: coin.name,
              symbol: coin.symbol,
              price: coin.current_price,
              drop_percent: drop,
              timestamp: new Date().toISOString(),
            })
          );
        }
      });

      channel.ack(msg);
    }
  });
}

startWorker().catch((err) => {
  console.error("Worker error:", err);
  process.exit(1);
});
