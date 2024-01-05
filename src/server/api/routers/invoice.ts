import { z } from "zod";
import { eq, like } from "drizzle-orm";
// UTILS
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
// SCHEMA/s
import { customers, invoices } from "@/server/db/schema";
import { InvoiceSchema } from "@/lib/schema";

const invoiceRouter = createTRPCRouter({
  create: publicProcedure
    .input(InvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(invoices).values(input);
    }),

  getAll: publicProcedure
    .input(
      z.object({
        query: z.string().optional().default(""),
        page: z.number().optional().default(1),
        per_page: z.number().optional().default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      let invoiceQuery;
      const { query, page, per_page } = input;

      if (query.length === 0) {
        invoiceQuery = ctx.db.query.invoices
          .findMany({
            with: {
              customer: true,
            },
          })
          .prepare();
      } else {
        invoiceQuery = ctx.db
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
          .where(like(customers.name, `%${query?.toLowerCase()}%`))
          .prepare();
      }
      const fetchedInvoices = await invoiceQuery.execute();

      // pagination logic
      const start = (page - 1) * per_page;
      const end = start + per_page;
      const paginatedInvoiceData =
        fetchedInvoices.length < per_page
          ? fetchedInvoices
          : fetchedInvoices.slice(start, end);

      return {
        invoices: paginatedInvoiceData,
        hasPreviousPage: start > 0,
        hasNextPage: end < fetchedInvoices.length,
        total_page: Math.ceil(fetchedInvoices.length / per_page),
      };
    }),
});

export default invoiceRouter;
