import { redirect } from "next/navigation";
import { z } from "zod";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LockIcon from "@/ui/icons/lockIcon";
import EmailIcon from "@/ui/icons/emailIcon";
import FormSubmitButton from "@/components/formSubmitButton";

import { signIn } from "@/auth";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const callbackUrl = String(formData.get("callbackUrl") || "/dashboard");

  const parsed = LoginSchema.safeParse({ email, password });
  if (!parsed.success) {
    const firstErr = parsed.error.issues[0]?.message || "Invalid input.";
    redirect(`/login?error=${encodeURIComponent(firstErr)}`);
  }

  if (typeof signIn !== "function") {
    return redirect(
      `/login?error=${encodeURIComponent(
        "next-auth v5 signIn missing (import from @/auth)"
      )}`
    );
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (err) {
    const e = err as any;
    if (
      e &&
      typeof e === "object" &&
      typeof e.digest === "string" &&
      e.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    if (e && typeof e === "object") {
      if (typeof e.type === "string") {
        return redirect(`/login?error=${encodeURIComponent(e.type)}`);
      }
      if (typeof e.message === "string") {
        return redirect(`/login?error=${encodeURIComponent(e.message)}`);
      }
    }
    return redirect(`/login?error=${encodeURIComponent("Unknown error")}`);
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const errorParam =
    typeof params?.error === "string" ? params.error : undefined;
  const callbackUrl =
    typeof params?.callbackUrl === "string" ? params.callbackUrl : "/dashboard";

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-[radial-gradient(1000px_600px_at_10%_-20%,hsl(var(--primary)/0.12),transparent),radial-gradient(800px_500px_at_90%_120%,hsl(var(--secondary)/0.12),transparent)]">
      <Card className="w-full max-w-md border border-white/10 bg-background/60 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary/10 to-primary/20 ring-1 ring-primary/20">
            <span className="text-base">⚡</span>
          </div>
          <CardTitle className="text-2xl tracking-tight">
            Login to your account
          </CardTitle>
          <CardDescription>
            Welcome back! Enter your details to continue.
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>

        {/* Server Action form */}
        <form action={loginAction} className="contents" noValidate>
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <CardContent className="space-y-5">
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
              <div className="flex items-center justify-between">
                <label className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center">
                  <LockIcon />
                </span>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 rounded-lg pl-9"
                  required
                />
              </div>
            </div>

            {errorParam && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errorParam}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <FormSubmitButton text1="Loading" text2="Log in" />

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a className="underline underline-offset-4" href="/register">
                Create one
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
