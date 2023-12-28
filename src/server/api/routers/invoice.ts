import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { invoices } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const invoiceRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        customer_id: z.string(),
        acmount: z.number(),
        status: z.enum(["pending", "paid"]).default("pending"),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(invoices).values({ ...input });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.invoices.findMany();
  }),

  getByCustomerId: publicProcedure
    .input(z.object({ customer_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.invoices.findFirst({
        where: eq(invoices.customer_id, input.customer_id),
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        customer_id: z.string(),
        acmount: z.number(),
        status: z.enum(["pending", "paid"]).default("pending"),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(invoices)
        .set({ ...input })
        .where(eq(invoices.customer_id, input.customer_id));
    }),

  delete: publicProcedure
    .input(z.object({ customer_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(invoices)
        .where(eq(invoices.customer_id, input.customer_id));
    }),
});

export default invoiceRouter;
