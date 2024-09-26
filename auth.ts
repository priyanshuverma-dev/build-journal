import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import db from "./lib/db";

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
    signOut: "/auth",
  },

  ...authConfig,
});
