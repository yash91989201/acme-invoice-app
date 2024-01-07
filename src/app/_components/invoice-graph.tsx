"use client";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from "chart.js/auto";
// ICONS
import { CalendarClock } from "lucide-react";

ChartJS.register(Tooltip, BarElement, LinearScale, CategoryScale);
ChartJS.defaults.scale.grid.display = false;

export default function InvoiceGraph({ revenue }: { revenue: RevenueType }) {
  const revenueData = Object.entries(revenue).map(([month]) => ({
    label: month,
    value: revenue[month]!,
  }));

  return (
    <div className="flex flex-col gap-3">
      <h5 className="text-lg font-semibold md:text-2xl">Latest Revenue</h5>
      <div className="w-ful flex min-h-48  flex-col  gap-4 rounded-lg bg-gray-100 p-4 lg:h-full">
        <div className="flex h-full items-end rounded-lg bg-white p-3">
          <Bar
            data={{
              labels: revenueData.map((data) => data.label.toUpperCase()),
              datasets: [
                {
                  label: "Revenue (in Rs.)",
                  data: revenueData.map((data) => data.value),
                  backgroundColor: "#2563eb99",
                  borderRadius: 4,
                },
              ],
            }}
          />
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <CalendarClock className="size-4 md:size-5" />
          <p className="text-sm sm:text-base">Last 12 Months</p>
        </div>
      </div>
    </div>
  );
}
