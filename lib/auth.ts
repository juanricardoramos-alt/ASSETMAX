import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/constants";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Email & Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null;
      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLowerCase().trim() },
      });
      if (!user?.passwordHash) return null;
      const valid = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!valid) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
  pages: {
    signIn: "/en/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On sign-in (or session update) load role + id from the database.
      if (user || trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email ?? undefined },
          select: { id: true, role: true, verifiedSeller: true },
        });
        if (dbUser) {
          token.uid = dbUser.id;
          token.role = dbUser.role as Role;
          token.verifiedSeller = dbUser.verifiedSeller;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.uid as string) ?? "";
        session.user.role = (token.role as Role) ?? "INVESTOR";
        session.user.verifiedSeller = Boolean(token.verifiedSeller);
      }
      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}
