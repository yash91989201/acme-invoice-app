// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import InvoiceStats from "@/app/_components/invoice-stats";
import InvoiceGraph from "@/app/_components/invoice-graph";
import LatestInvoices from "@/app/_components/latest-invoices";

export default async function Dashboard() {
  const revenues = await api.invoice.getRevenue.query();
  const revenue = revenues[0] as RevenueType;

  return (
    <div className="flex flex-col gap-6">
      <h5 className="text-lg font-semibold md:text-3xl">Dashboard</h5>

      <InvoiceStats />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <InvoiceGraph revenue={revenue} />
        <LatestInvoices />
      </div>
    </div>
  );
}
