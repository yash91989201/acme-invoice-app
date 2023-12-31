import { relations, sql } from "drizzle-orm";
import {
  int,
  primaryKey,
  text,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
  mysqlEnum,
  date,
} from "drizzle-orm/mysql-core";
import type { AdapterAccount } from "@auth/core/adapters";

export const mysqlTable = mysqlTableCreator(
  (name) => `acme-invoice-app_${name}`,
);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const customers = mysqlTable(
  "customer",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    image: varchar("image", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.name),
    };
  },
);

export const customersRelations = relations(customers, ({ many }) => ({
  invoices: many(invoices),
}));

export const invoices = mysqlTable("invoice", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  customer_id: varchar("customer_id", { length: 255 }).notNull(),
  amount: int("amount").notNull(),
  status: mysqlEnum("status", ["pending", "paid"]).notNull(),
  date: date("date").notNull(),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  customer: one(customers, {
    fields: [invoices.customer_id],
    references: [customers.id],
    relationName: "invoices",
  }),
}));

export const revenue = mysqlTable("renvenue", {
  month: mysqlEnum("month", [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ]).notNull(),
  revenue: int("revenue").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
