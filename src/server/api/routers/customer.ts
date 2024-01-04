import { z } from "zod";
import { eq, like } from "drizzle-orm";
// UTILS
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
// SCHEMAS
import { CustomerSchema, DeleteCustomerSchema } from "@/lib/schema";
import { customers } from "@/server/db/schema";

const customerRouter = createTRPCRouter({
  create: publicProcedure
    .input(CustomerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(customers).values({ ...input });
    }),

  getAll: publicProcedure
    .input(z.object({ query: z.string().optional().default("") }))
    .query(({ ctx, input }) => {
      if (input.query.length === 0) return ctx.db.query.customers.findMany();

      return ctx.db.query.customers.findMany({
        where: like(customers.name, `%${input.query?.toLowerCase()}%`),
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.customers.findFirst({
        where: eq(customers.id, input.id),
      });
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
