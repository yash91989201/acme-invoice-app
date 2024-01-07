import { Suspense } from "react";
// CUSTOM COMPONENTS
import InvoiceStats, {
  InvoiceStatsSkeleton,
} from "@/app/_components/invoice-stats";
import InvoiceGraph, {
  InvoiceGraphSkeleton,
} from "@/app/_components/invoice-graph";
import LatestInvoices from "@/app/_components/latest-invoices";

export default async function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h5 className="text-lg font-semibold md:text-3xl">Dashboard</h5>
      <Suspense fallback={<InvoiceStatsSkeleton />}>
        <InvoiceStats />
      </Suspense>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Suspense fallback={<InvoiceGraphSkeleton />}>
          <InvoiceGraph />
          <LatestInvoices />
        </Suspense>
      </div>
    </div>
  );
}
