import NextAuth from "next-auth";
// AUTH
import { authOptions } from "@/server/auth";
// TYPES
import type { AuthOptions } from "next-auth";

const handler = NextAuth(authOptions) as AuthOptions;

export { handler as GET, handler as POST };
