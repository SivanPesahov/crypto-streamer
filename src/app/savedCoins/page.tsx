import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const metadata = {
  title: "Saved Coins",
};

export default async function SavedCoinsPage() {
  const session = await auth();

  const user = session?.user;
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="border border-white/10 bg-background/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Saved coins</CardTitle>
          <CardDescription>
            {`Welcome${
              user?.name ? `, ${user.name}` : ""
            }. Your personal list will appear here.`}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
