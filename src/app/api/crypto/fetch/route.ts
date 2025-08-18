import { fetchFromCoingecko } from "@/lib/fetchFromCoingecko";

export async function GET() {
  try {
    const data = await fetchFromCoingecko();
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
