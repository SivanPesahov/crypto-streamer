import { fetchFromCoingecko } from "@/lib/fetchFromCoingecko";
import { publishToQueue } from "@/lib/publishToQueue";

export async function GET() {
  try {
    const data = await fetchFromCoingecko();

    await publishToQueue("crypto-data", data);

    return Response.json({ success: true, message: "Data sent to RabbitMQ" });
  } catch (error) {
    return Response.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
