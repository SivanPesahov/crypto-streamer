import DashboardClient from "@/components/DashboardClient";
import { getRealtimeData } from "@/lib/getRealtimeData";
import { getRisersAndFallers } from "@/lib/getRisersAndFallers";
import UserData from "@/components/userData";

export default async function DashboardPage() {
  const allData = await getRealtimeData();
  const [risers, fallers] = await getRisersAndFallers();

  return (
    <div className="space-y-6">
      <UserData />
      <DashboardClient allData={allData} risers={risers} fallers={fallers} />
    </div>
  );
}
