"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LockIcon from "@/ui/icons/lockIcon";
import EmailIcon from "@/ui/icons/emailIcon";
import AuthSpinner from "@/ui/spinners/authSpinner";
import PasswordInput from "@/components/passwordInput";
import FormSubmitButton from "@/components/formSubmitButton";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("callbackUrl") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: redirectTo,
      });

      if (!res) {
        setError("Unexpected error.");
        return;
      }
      if (res.error) {
        setError("Invalid email or password.");
        return;
      }
      router.push(res.url || redirectTo);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="contents"
            noValidate
          >
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center">
                          <EmailIcon />
                        </span>
                        <Input
                          type="email"
                          inputMode="email"
                          placeholder="m@example.com"
                          autoComplete="email"
                          className="h-11 rounded-lg pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center">
                          <LockIcon />
                        </span>
                        <PasswordInput field={field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                    {error && (
                      <p className="mt-1 text-sm text-red-600" role="alert">
                        {error}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <FormSubmitButton text1={"loading"} text2={"Log in"} />

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <a className="underline underline-offset-4" href="/register">
                  Create one
                </a>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
