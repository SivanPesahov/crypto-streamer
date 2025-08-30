import { auth } from "@/auth";
import { signOut } from "@/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import Link from "next/link";
import LoginUserDataButton from "../button-components/loginUserDataButton";

type Props = {
  session: Session | null;
};
export async function UserData({ session }: Props) {
  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  function getInitials(input?: string | null) {
    if (!input) return "";
    const parts = input.split(/\s+/).filter(Boolean).slice(0, 2);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
    return (
      parts[0]!.charAt(0).toUpperCase() + parts[1]!.charAt(0).toUpperCase()
    );
  }

  if (!session?.user) {
    return <LoginUserDataButton />;
  }

  const name = session.user.name || "";
  const email = session.user.email || "";
  const image = (session.user as any).image as string | undefined;
  const displayName = name || email;
  const initials = getInitials(name || email);

  return (
    <Card className="border border-white/10 bg-background/60 backdrop-blur-md ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-1 ring-primary/25">
              <AvatarImage src={image} alt={displayName} />
              <AvatarFallback className="text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="leading-tight">
              <CardTitle className="text-base font-medium">
                {displayName}
              </CardTitle>
              <CardDescription className="text-xs">
                Signed in as {email || displayName}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link href="saved-coins" aria-label="Go to favorite coins">
                Favorites
              </Link>
            </Button>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default UserData;
