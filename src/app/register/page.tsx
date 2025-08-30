import { z } from "zod";
import { registerAction } from "../register/actions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LockIcon from "@/ui/icons/lockIcon";
import EmailIcon from "@/ui/icons/emailIcon";
import UsernameIcon from "@/ui/icons/usernameIcon";
import FormSubmitButton from "@/components/costum-components/form-components/formSubmitButton";
import PasswordInput from "@/components/costum-components/form-components/passwordInput";

const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const errorParam =
    typeof params?.error === "string" ? params.error : undefined;
  const messageParam =
    typeof params?.message === "string" ? params.message : undefined;

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-[radial-gradient(1000px_600px_at_10%_-20%,hsl(var(--primary)/0.12),transparent),radial-gradient(800px_500px_at_90%_120%,hsl(var(--secondary)/0.12),transparent)]">
      <Card className="w-full max-w-md border border-white/10 bg-background/60 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary/10 to-primary/20 ring-1 ring-primary/20">
            <span className="text-base">📝</span>
          </div>
          <CardTitle className="text-2xl tracking-tight">
            Create a new account
          </CardTitle>
          <CardDescription>Enter your details to sign up.</CardDescription>
          <CardAction></CardAction>
        </CardHeader>

        <form action={registerAction} className="contents" noValidate>
          <CardContent className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center">
                  <UsernameIcon />
                </span>
                <Input
                  type="text"
                  name="name"
                  placeholder="Sivan"
                  autoComplete="name"
                  className="h-11 rounded-lg pl-9"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center">
                  <EmailIcon />
                </span>
                <Input
                  type="email"
                  name="email"
                  inputMode="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  className="h-11 rounded-lg pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center">
                  <LockIcon />
                </span>
                <PasswordInput
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 rounded-lg pl-9 pr-10"
                  required
                />
              </div>
              {errorParam && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errorParam}
                </p>
              )}
              {messageParam && (
                <p className="mt-1 text-sm text-green-700" role="status">
                  {messageParam}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <FormSubmitButton text1="Creating account..." text2="Register" />
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a className="underline underline-offset-4" href="/login">
                Login
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
