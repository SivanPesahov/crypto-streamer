import { NextResponse } from "next/server";
import { redis, connectRedis } from "@/lib/redis";
import { REDIS_KEYS } from "@/constants/redisKeys";

export async function GET() {
  try {
    await connectRedis();

    const data = await redis.get(REDIS_KEYS.CRYPTO_FALLERS);
    if (!data) {
      return NextResponse.json(
        { message: "No fallers found in Redis" },
        { status: 404 }
      );
    }

    const fallers = JSON.parse(data);
    return NextResponse.json(fallers);
  } catch (error) {
    console.error("[API][FALLERS] Error fetching fallers:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
