import { prisma } from "@/lib/prisma";

export async function getInitialFavorites(session: any): Promise<string[]> {
  if (!session?.user) return [];
  const rawId = (session.user as any).id;
  let userId = Number(rawId);

  if (!rawId || Number.isNaN(userId)) {
    const email = session.user?.email ?? undefined;
    if (email) {
      const userRow = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (userRow) {
        userId = userRow.id;
      }
    }
  }

  if (typeof userId === "number" && !Number.isNaN(userId)) {
    const favs = await prisma.favoriteCoin.findMany({
      where: { userId },
      select: { coinId: true },
    });
    return favs.map((f) => f.coinId);
  }
  return [];
}
