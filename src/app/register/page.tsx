"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import LockIcon from "@/ui/icons/lockIcon";
import EmailIcon from "@/ui/icons/emailIcon";
import UsernameIcon from "@/ui/icons/usernameIcon";
import AuthSpinner from "@/ui/spinners/authSpinner";
import PasswordInput from "@/components/passwordInput";
import FormSubmitButton from "@/components/formSubmitButton";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

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

  type RegisterFormValues = z.infer<typeof RegisterSchema>;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onBlur",
  });

  async function onSubmit(values: RegisterFormValues) {
    setError(null);
    setOkMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.error ||
          (data?.details && "Validation error") ||
          "Registration failed";
        setError(msg);
        return;
      }

      setOkMsg("Registered successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 700);
    } catch (err) {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="contents"
            noValidate
          >
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center">
                          <UsernameIcon />
                        </span>
                        <Input
                          type="text"
                          placeholder="Sivan"
                          autoComplete="name"
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
                    <FormLabel>Password</FormLabel>
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
                    {okMsg && (
                      <p className="mt-1 text-sm text-green-700" role="status">
                        {okMsg}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              {/* <Button
                type="submit"
                className="w-full h-11 rounded-lg shadow-lg transition-shadow hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <AuthSpinner />
                    Creating account...
                  </span>
                ) : (
                  "Register"
                )}
              </Button> */}
              <FormSubmitButton text1={"loading"} text2={"Register"} />

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a className="underline underline-offset-4" href="/login">
                  Login
                </a>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
