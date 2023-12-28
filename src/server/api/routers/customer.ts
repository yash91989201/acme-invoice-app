import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { customers } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const customerRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(customers).values({ ...input });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.customers.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.customers.findFirst({
        where: eq(customers.id, input.id),
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(customers)
        .set({ ...input })
        .where(eq(customers.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(customers).where(eq(customers.id, input.id));
    }),
});

export default customerRouter;
