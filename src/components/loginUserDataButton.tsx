import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";

export function LoginUserDataButton() {
  return (
    <Card className="border border-white/10 bg-background/60 backdrop-blur-md">
      <CardHeader className="text-center space-y-3">
        <CardTitle className="text-base">You are not signed in</CardTitle>
        <Button
          asChild
          className="mx-auto h-9 rounded-full shadow-sm hover:shadow"
          variant={"outline"}
        >
          <Link href="/login" className="inline-flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </Button>
      </CardHeader>
    </Card>
  );
}

export default LoginUserDataButton;
