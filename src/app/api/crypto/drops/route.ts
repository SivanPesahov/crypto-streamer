import { NextResponse } from "next/server";
import { redis, connectRedis } from "@/lib/redis/redis";

export async function GET() {
  await connectRedis();

  const keys = await redis.keys("drop:*");

  const results = [];

  for (const key of keys) {
    const data = await redis.get(key);
    if (data) {
      results.push(JSON.parse(data));
    }
  }

  return NextResponse.json({ drops: results });
}
