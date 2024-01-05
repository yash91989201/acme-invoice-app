import { z } from "zod";
import { eq, like, sql } from "drizzle-orm";
import { initEdgeStore } from "@edgestore/server";
import { initEdgeStoreClient } from "@edgestore/server/core";
// UTILS
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
// SCHEMAS
import { customers, invoices } from "@/server/db/schema";
import { CustomerSchema, DeleteCustomerSchema } from "@/lib/schema";
// TYPES
import type { CustomerType } from "@/lib/schema";

const es = initEdgeStore.create();
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
});

const edgeStoreBackendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});

const customerRouter = createTRPCRouter({
  create: publicProcedure
    .input(CustomerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(customers).values(input);
    }),

  getAll: publicProcedure
    .input(
      z.object({
        query: z.string().optional().default(""),
        page: z.number().optional(),
        per_page: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let customersQuery;
      const { query, page = 0, per_page = 0 } = input;

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
      if (page > 0 && per_page > 0) {
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
      }

      return {
        customers: fetchedCustomers,
        hasPreviousPage: false,
        hasNextPage: false,
        total_page: 0,
      };
    }),

  update: publicProcedure
    .input(CustomerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(customers)
        .set(input)
        .where(eq(customers.id, input.id));
    }),

  delete: publicProcedure
    .input(DeleteCustomerSchema)
    .mutation(async ({ ctx, input }) => {
      const customer = (await ctx.db.query.customers.findFirst({
        where: eq(customers.id, input.id),
      })) as CustomerType;

      await edgeStoreBackendClient.publicFiles.deleteFile({
        url: customer.image,
      });

      await ctx.db.delete(customers).where(eq(customers.id, input.id));
    }),
});

export default customerRouter;
