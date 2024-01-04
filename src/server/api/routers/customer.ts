import { z } from "zod";
import { eq, like, sql } from "drizzle-orm";
// UTILS
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
// SCHEMAS
import { customers, invoices } from "@/server/db/schema";
import { CustomerSchema, DeleteCustomerSchema } from "@/lib/schema";

const customerRouter = createTRPCRouter({
  create: publicProcedure
    .input(CustomerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(customers).values({ ...input });
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
      let customersQuery;
      const { query, page, per_page } = input;

      if (query.length === 0) {
        customersQuery = ctx.db
          .select({
            id: customers.id,
            name: customers.name,
            email: customers.email,
            image: customers.image,
            total_invoices: sql<number>`COUNT(${invoices.id}) AS total_invoices`,
            total_pending: sql<number>`SUM(CASE WHEN ${invoices.status} = 'pending' THEN 1 ELSE 0 END) AS total_pending`,
            total_paid: sql<number>`SUM(CASE WHEN ${invoices.status} = 'paid' THEN 1 ELSE 0 END) AS total_paid`,
          })
          .from(customers)
          .leftJoin(invoices, eq(customers.id, invoices.customer_id))
          .groupBy(
            customers.id,
            customers.name,
            customers.email,
            customers.image,
          )
          .prepare();
      } else {
        customersQuery = ctx.db
          .select({
            id: customers.id,
            name: customers.name,
            email: customers.email,
            image: customers.image,
            total_invoices: sql<number>`COUNT(${invoices.id}) AS total_invoices`,
            total_pending: sql<number>`SUM(CASE WHEN ${invoices.status} = 'pending' THEN 1 ELSE 0 END) AS total_pending`,
            total_paid: sql<number>`SUM(CASE WHEN ${invoices.status} = 'paid' THEN 1 ELSE 0 END) AS total_paid`,
          })
          .from(customers)
          .leftJoin(invoices, eq(customers.id, invoices.customer_id))
          .where(like(customers.name, `%${query?.toLowerCase()}%`))
          .groupBy(
            customers.id,
            customers.name,
            customers.email,
            customers.image,
          )
          .prepare();
      }

      const fetchedCustomers = await customersQuery.execute();

      // pagination logic
      const start = (page - 1) * per_page;
      const end = start + per_page;
      const paginatedCustomerData =
        fetchedCustomers.length < per_page
          ? fetchedCustomers
          : fetchedCustomers.slice(start, end);

      return {
        customers: paginatedCustomerData,
        hasPreviousPage: start > 0,
        hasNextPage: end < fetchedCustomers.length,
        total_page: Math.ceil(fetchedCustomers.length / per_page),
      };
    }),

  update: publicProcedure
    .input(CustomerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(customers)
        .set({ ...input })
        .where(eq(customers.id, input.id));
    }),

  delete: publicProcedure
    .input(DeleteCustomerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(customers).where(eq(customers.id, input.id));
    }),
});

export default customerRouter;
