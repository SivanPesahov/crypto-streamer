import { NextResponse } from "next/server";
import { redis, connectRedis } from "@/lib/redis/redis";
import { REDIS_KEYS } from "@/constants/redisKeys";

export async function GET() {
  try {
    await connectRedis();

    const data = await redis.get(REDIS_KEYS.CRYPTO_RISERS);
    if (!data) {
      return NextResponse.json(
        { message: "No risers found in Redis" },
        { status: 404 }
      );
    }

    const risers = JSON.parse(data);
    return NextResponse.json(risers);
  } catch (error) {
    console.error("[API][RISERS] Error fetching risers:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
