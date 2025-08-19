import { connectRedis, redis } from "./redis";
import { REDIS_KEYS } from "../constants/redisKeys";
import { CryptoCoin } from "@/types/coinType";

export async function getRealtimeData(): Promise<CryptoCoin[] | null> {
  await connectRedis();
  const data = await redis.get(REDIS_KEYS.CRYPTO_REALTIME);
  if (!data) return null;
  return JSON.parse(data);
}
