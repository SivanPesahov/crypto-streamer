import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const {
  handlers, // לשימוש ב-API Route
  auth, // לשימוש בצד השרת (בדיקת session)
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // אימות משתמש
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) return null;

        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;

        // מה שנחזיר כאן ייכנס ל-JWT / session
        return {
          id: String(user.id),
          email: user.email,
          name: user.name ?? undefined,
          role: user.role, // נשתמש בזה להרשאות בהמשך
        };
      },
    }),
  ],
  // דפים מובנים: עדיין אפשר להיכנס ל- /api/auth/signin
  // אם תרצה דף לוגין מותאם ניצור בהמשך: pages: { signIn: "/login" }

  // כדי ש-next-auth ישתמש ב-AUTH_SECRET שלך מה-.env
  secret: process.env.AUTH_SECRET,
});
