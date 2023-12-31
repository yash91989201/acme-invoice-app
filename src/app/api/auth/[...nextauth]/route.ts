import NextAuth from "next-auth";
// AUTH
import { authOptions } from "@/server/auth";
// TYPES
import type { NextAuthOptions } from "next-auth";

const handler = NextAuth(authOptions) as NextAuthOptions;

export { handler as GET, handler as POST };
