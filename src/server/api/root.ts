import { createTRPCRouter } from "@/server/api/trpc";
import customerRouter from "./routers/customer";
import invoiceRouter from "./routers/invoice";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customer: customerRouter,
  invoice: invoiceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
