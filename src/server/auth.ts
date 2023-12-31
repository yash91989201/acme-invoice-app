import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getServerSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";

import { db } from "@/server/db";
import { env } from "@/env";
import { mysqlTable } from "@/server/db/schema";

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

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
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
