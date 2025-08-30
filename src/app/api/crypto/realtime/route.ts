import { NextResponse } from "next/server";
import { redis, connectRedis } from "@/lib/redis/redis";
import { REDIS_KEYS } from "@/constants/redisKeys";

export async function GET() {
  try {
    await connectRedis();

    const data = await redis.get(REDIS_KEYS.CRYPTO_REALTIME);

    if (!data) {
      return NextResponse.json(
        { error: "No data found in Redis" },
        { status: 404 }
      );
    }

    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Redis GET error:", error);
    return NextResponse.json(
      { error: "Redis error", details: String(error) },
      { status: 500 }
    );
  }
}
