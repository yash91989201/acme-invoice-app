import { z } from "zod";
import { count, eq, like, sql } from "drizzle-orm";
// UTILS
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
// SCHEMA/s
import { InvoiceSchema } from "@/lib/schema";
import { customers, invoices } from "@/server/db/schema";

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

  getLatest: publicProcedure.query(({ ctx }) => {
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
      .leftJoin(customers, eq(customers.id, invoices.customer_id))
      .limit(5);
  }),
  getStats: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        total_invoices: count(invoices.id).mapWith(Number),
        total_pending:
          sql<number>`sum(case when ${invoices.status} = 'pending' then ${invoices.amount} else 0 end)`.mapWith(
            Number,
          ),
        total_paid:
          sql<number>`sum(case when ${invoices.status} = 'paid' then ${invoices.amount} else 0 end)`.mapWith(
            Number,
          ),
      })
      .from(invoices);
  }),

  getRevenue: publicProcedure.query(({ ctx }) => {
    return ctx.db
      .select({
        jan: sql<number>`sum(case when month(${invoices.date}) = 1 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
        feb: sql<number>`sum(case when month(${invoices.date}) = 2 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
        mar: sql<number>`sum(case when month(${invoices.date}) = 3 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
        apr: sql<number>`sum(case when month(${invoices.date}) = 4 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
        may: sql<number>`sum(case when month(${invoices.date}) = 5 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
        jun: sql<number>`sum(case when month(${invoices.date}) = 6 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
        jul: sql<number>`sum(case when month(${invoices.date}) = 7 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
        aug: sql<number>`sum(case when month(${invoices.date}) = 8 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
        sep: sql<number>`sum(case when month(${invoices.date}) = 9 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
        oct: sql<number>`sum(case when month(${invoices.date}) = 10 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
        nov: sql<number>`sum(case when month(${invoices.date}) = 11 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
        dec: sql<number>`sum(case when month(${invoices.date}) = 12 then ${invoices.amount} else 0 end)`.mapWith(
          Number,
        ),
      })
      .from(invoices)
      .where(eq(invoices.status, "paid"))
      .prepare()
      .execute();
  }),
});

export default invoiceRouter;
