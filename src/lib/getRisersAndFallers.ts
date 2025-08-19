import { connectRedis, redis } from "./redis";
import { REDIS_KEYS } from "../constants/redisKeys";
import { CryptoCoin } from "@/types/coinType";

export async function getRisersAndFallers(): Promise<
  [CryptoCoin[], CryptoCoin[]]
> {
  await connectRedis();
  const risersRaw = await redis.get(REDIS_KEYS.CRYPTO_RISERS);
  const fallersRaw = await redis.get(REDIS_KEYS.CRYPTO_FALLERS);

  const risers: CryptoCoin[] = risersRaw ? JSON.parse(risersRaw) : [];
  const fallers: CryptoCoin[] = fallersRaw ? JSON.parse(fallersRaw) : [];

  return [risers, fallers];
}
