"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/sql/prisma";

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

export async function registerAction(formData: FormData) {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || "Invalid input";
    return redirect(`/register?error=${encodeURIComponent(msg)}`);
  }

  const name = parsed.data.name?.trim() || "";
  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return redirect(
        `/register?error=${encodeURIComponent("Email already registered")}`
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        role: "USER",
      },
    });

    return redirect(
      `/login?message=${encodeURIComponent(
        "Registered successfully. Please log in."
      )}`
    );
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

    if (e && typeof e === "object" && e.code === "P2002") {
      return redirect(
        `/register?error=${encodeURIComponent("Email already registered")}`
      );
    }

    if (e && typeof e === "object" && typeof e.message === "string") {
      return redirect(`/register?error=${encodeURIComponent(e.message)}`);
    }

    return redirect(`/register?error=${encodeURIComponent("Unknown error")}`);
  }
}
