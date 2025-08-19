import { connectRedis, redis } from "../lib/redis";
import { CryptoCoin } from "@/types/coinType";
import { connectRabbitMQ } from "../lib/rabbitmq";
import { REDIS_KEYS } from "../constants/redisKeys";

async function startRisersWorker() {
  try {
    await connectRedis();
    const { connection, channel } = await connectRabbitMQ();
    const queue = "crypto-data";

    await channel.assertQueue(queue, { durable: false });

    console.log("[RisersWorker] Waiting for messages...");

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const coins: CryptoCoin[] = JSON.parse(msg.content.toString());

        const risers = coins.filter(
          (coin) => coin.price_change_percentage_24h > 2
        );
        const fallers = coins.filter(
          (coin) => coin.price_change_percentage_24h < -2
        );

        await redis.set(REDIS_KEYS.CRYPTO_RISERS, JSON.stringify(risers));
        await redis.set(REDIS_KEYS.CRYPTO_FALLERS, JSON.stringify(fallers));

        console.log(
          `[RisersWorker] Saved ${risers.length} risers to Redis (${REDIS_KEYS.CRYPTO_RISERS})`
        );
        console.log(
          `[RisersWorker] Saved ${fallers.length} fallers to Redis (${REDIS_KEYS.CRYPTO_FALLERS})`
        );

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("[RisersWorker] Error:", error);
  }
}

startRisersWorker();
