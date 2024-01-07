import { api } from "@/trpc/server";
import RevenueBarGraph from "./revenue-bar-graph";
// ICONS
import { CalendarClock } from "lucide-react";

export default async function InvoiceGraph() {
  const revenues = await api.invoice.getRevenue.query();
  const revenue = revenues[0] as RevenueType;
  const revenueData = Object.entries(revenue).map(([month]) => ({
    label: month,
    value: revenue[month]!,
  }));

  return (
    <div className="flex flex-col gap-3">
      <h5 className="text-lg font-semibold md:text-2xl">Latest Revenue</h5>
      <div className="w-ful flex min-h-48  flex-col  gap-4 rounded-lg bg-gray-100 p-4 lg:h-full">
        <div className="flex h-full items-end rounded-lg bg-white p-3">
          <RevenueBarGraph graphData={revenueData} />
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <CalendarClock className="size-4 md:size-5" />
          <p className="text-sm sm:text-base">Last 12 Months</p>
        </div>
      </div>
    </div>
  );
}
