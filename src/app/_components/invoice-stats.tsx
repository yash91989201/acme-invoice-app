// UTILS
import { api } from "@/trpc/server";
import { formatAmount } from "@/lib/utils";

export default async function InvoiceStats() {
  const invoiceStats = await api.invoice.getStats.query();
  const customerStats = await api.customer.getCount.query();

  const invoiceStat = invoiceStats[0] as InvoiceStatsType;
  const customerStat = customerStats[0] as CustomerStatsType;

  return (
    <div className="grid  grid-cols-2 gap-3  sm:gap-6 lg:grid-cols-4">
      <StatCard
        title="Total Collected"
        value={formatAmount(invoiceStat.total_paid)}
      />
      <StatCard
        title="Total Pending"
        value={formatAmount(invoiceStat.total_pending)}
      />
      <StatCard
        title="Total Invoices"
        value={invoiceStat.total_invoices.toString()}
      />
      <StatCard
        title="Total Customers"
        value={customerStat.total_customers.toString()}
      />
    </div>
  );
}

const StatCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-gray-100 p-3 ">
      <p className="text-sm sm:text-base">{title}</p>
      <p className="rounded-lg bg-white p-3 text-center font-semibold  sm:text-lg md:p-6">
        {value}
      </p>
    </div>
  );
};
