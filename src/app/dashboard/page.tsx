import DashboardClient from "@/components/costum-components/section-components/dashboardClient";
import { getRisersAndFallers } from "@/lib/redis/getRisersAndFallers";
import UserData from "@/components/costum-components/section-components/userData";
import { auth } from "@/auth";
import { getInitialFavorites } from "@/lib/sql/getInitialFavorites";
import { getRealtimeData } from "@/lib/redis/getRealtimeData";

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
