import DashboardClient from "@/components/DashboardClient";
import { getRealtimeData } from "@/lib/getRealtimeData";
import { getRisersAndFallers } from "@/lib/getRisersAndFallers";

export default async function DashboardPage() {
  const allData = await getRealtimeData();
  const [risers, fallers] = await getRisersAndFallers();

  return (
    <DashboardClient allData={allData} risers={risers} fallers={fallers} />
  );
}
