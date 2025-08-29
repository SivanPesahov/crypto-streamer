import DashboardClient from "@/components/DashboardClient";
import { getRealtimeData } from "@/lib/getRealtimeData";
import { getRisersAndFallers } from "@/lib/getRisersAndFallers";
import UserData from "@/components/userData";
import { auth } from "@/auth";
import { getInitialFavorites } from "@/lib/getInitialFavorites";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const allData = await getRealtimeData();
  const [risers, fallers] = await getRisersAndFallers();
  const sp = await searchParams;
  const filter = sp?.filter ?? null;
  const session = await auth();
  const isLoggedIn = session?.user ? true : false;
  const initialFavorites = await getInitialFavorites(session);
  return (
    <div className="space-y-6">
      <UserData session={session} />
      <DashboardClient
        allData={allData}
        risers={risers}
        fallers={fallers}
        isLoggedIn={isLoggedIn}
        initialFavorites={initialFavorites}
        filter={filter}
      />
    </div>
  );
}
