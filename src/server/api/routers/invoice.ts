import { z } from "zod";
import { eq, like } from "drizzle-orm";
// UTILS
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
// SCHEMA/s
import { customers, invoices } from "@/server/db/schema";
import { DeleteCustomerSchema, InvoiceSchema } from "@/lib/schema";

const invoiceRouter = createTRPCRouter({
  create: publicProcedure
    .input(InvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(invoices).values(input);
    }),

  getAll: publicProcedure
    .input(z.object({ query: z.string().optional().default("") }))
    .query(({ ctx, input }) => {
      if (input.query.length === 0) {
        return ctx.db.query.invoices.findMany({
          with: {
            customer: true,
          },
        });
      }

      return ctx.db
        .select({
          id: invoices.id,
          customer_id: invoices.customer_id,
          date: invoices.date,
          status: invoices.status,
          amount: invoices.amount,
          customer: {
            id: customers.id,
            name: customers.name,
            email: customers.email,
            image: customers.image,
          },
        })
        .from(invoices)
        .innerJoin(customers, eq(customers.id, invoices.customer_id))
        .where(like(customers.name, `%${input.query?.toLowerCase()}%`));
    }),

  getByCustomerId: publicProcedure
    .input(z.object({ customer_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.invoices.findFirst({
        where: eq(invoices.customer_id, input.customer_id),
      });
    }),

  update: publicProcedure
    .input(InvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(invoices)
        .set(input)
        .where(eq(invoices.customer_id, input.customer_id));
    }),

  delete: publicProcedure
    .input(DeleteCustomerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(invoices).where(eq(invoices.id, input.id));
    }),
});

export default invoiceRouter;
