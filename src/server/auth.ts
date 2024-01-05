import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getServerSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
// UTILS
import { env } from "@/env";
import { db } from "@/server/db";
import { mysqlTable } from "@/server/db/schema";
// TYPES
import type { DefaultSession } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import type { AuthOptions } from "next-auth";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 */

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 */

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/sign-in",
    signOut: "/dashboard/sign-out",
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: DrizzleAdapter(db, mysqlTable) as Adapter,
  providers: [
    GithubProvider({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
