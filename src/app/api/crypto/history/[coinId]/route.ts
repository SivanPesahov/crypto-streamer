import { getCoinHistory } from "../../../../../lib/coin-gecko/getCoinHistory";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { coinId: string } }
) {
  const { coinId } = params;

  try {
    const prices = await getCoinHistory(coinId, 6);

    const dailyMap = new Map<string, number>();

    for (const [timestamp, price] of prices) {
      const date = new Date(timestamp).toISOString().split("T")[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, price);
      }
    }

    const formatted = Array.from(dailyMap.entries()).map(([date, price]) => ({
      date,
      price,
    }));

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching coin history:", error);
    return new Response("Failed to fetch coin history", { status: 500 });
  }
}
