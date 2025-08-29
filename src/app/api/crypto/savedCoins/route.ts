import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { upsertFavoriteWithMeta } from "@/lib/favorites";

async function resolveUserId() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", status: 401 } as const;

  const rawId = (session.user as any).id;
  let userId = Number(rawId);

  if (!rawId || Number.isNaN(userId)) {
    const email = session.user?.email ?? undefined;
    if (!email)
      return {
        error: "Missing user id/email in session",
        status: 400,
      } as const;

    const userRow = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!userRow) return { error: "User not found", status: 404 } as const;
    userId = userRow.id;
  }

  return { userId } as const;
}

export async function POST(req: Request) {
  const resolved = await resolveUserId();
  if ("error" in resolved) {
    return NextResponse.json(
      { error: resolved.error },
      { status: resolved.status }
    );
  }
  const { userId } = resolved;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const coinId: string = String(body?.coinId || "")
    .trim()
    .toLowerCase();
  const action: "add" | "remove" = body?.action;

  const rawName = typeof body?.name === "string" ? body.name : undefined;
  const rawSymbol = typeof body?.symbol === "string" ? body.symbol : undefined;
  const rawImage = typeof body?.image === "string" ? body.image : undefined;

  const metaName = rawName?.trim() || undefined;
  const metaSymbol = rawSymbol ? rawSymbol.trim().toUpperCase() : undefined;
  const metaImage = rawImage?.trim() || undefined;

  if (!coinId) {
    return NextResponse.json({ error: "coinId is required" }, { status: 400 });
  }
  if (action !== "add" && action !== "remove") {
    return NextResponse.json(
      { error: "action must be 'add' or 'remove'" },
      { status: 400 }
    );
  }

  try {
    if (action === "add") {
      await upsertFavoriteWithMeta(userId, coinId, {
        name: metaName,
        symbol: metaSymbol,
        image: metaImage,
      });
    } else {
      await prisma.favoriteCoin.deleteMany({ where: { userId, coinId } });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/crypto/savedCoins POST error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const resolved = await resolveUserId();
  if ("error" in resolved) {
    return NextResponse.json(
      { error: resolved.error },
      { status: resolved.status }
    );
  }
  const { userId } = resolved;

  try {
    const favorites = await prisma.favoriteCoin.findMany({
      where: { userId },
      select: { coinId: true },
    });
    return NextResponse.json(favorites.map((f) => f.coinId));
  } catch (err) {
    console.error("/api/crypto/savedCoins GET error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
