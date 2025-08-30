import { connectRabbitMQ } from "../lib/rabbitmq/rabbitmq";
import { connectRedis, redis } from "../lib/redis/redis";
import { REDIS_KEYS } from "../constants/redisKeys";

async function startWorker() {
  await connectRedis();
  const { connection, channel } = await connectRabbitMQ();
  const queue = "crypto-data";

  await channel.assertQueue(queue, { durable: true });

  console.log(`👷 Worker listening on queue "${queue}"...`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const content = msg.content.toString();
      const coins = JSON.parse(content);
      await redis.set(REDIS_KEYS.CRYPTO_REALTIME, JSON.stringify(coins));
      channel.ack(msg);
    }
  });
}

startWorker().catch((err) => {
  console.error("Worker error:", err);
  process.exit(1);
});
