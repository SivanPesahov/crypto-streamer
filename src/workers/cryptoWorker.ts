import { connectRabbitMQ } from "../lib/rabbitmq";
import { connectRedis, redis } from "../lib/redis";
import { REDIS_KEYS } from "../constants/redisKeys";

async function startWorker() {
  await connectRedis();
  const { connection, channel } = await connectRabbitMQ();
  const queue = "crypto-data";

  await channel.assertQueue(queue, { durable: false });

  console.log(`👷 Worker listening on queue "${queue}"...`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const content = msg.content.toString();
      const coins = JSON.parse(content);
      await redis.set(REDIS_KEYS.CRYPTO_REALTIME, JSON.stringify(coins));

      coins.forEach(async (coin: any) => {
        const drop = coin.price_change_percentage_24h;

        if (drop < -5) {
          console.log(
            `🔻 ${coin.name} (${coin.symbol.toUpperCase()}): ${drop.toFixed(
              2
            )}%`
          );

          await redis.set(
            `${REDIS_KEYS.DROP}: ${coin.id}`,
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
