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

ChartJS.register(Tooltip, BarElement, LinearScale, CategoryScale);
ChartJS.defaults.scale.grid.display = false;

type GraphDataType = {
  label: string;
  value: number;
};

export default function RevenueBarGraph({
  graphData,
}: {
  graphData: GraphDataType[];
}) {
  return (
    <Bar
      data={{
        labels: graphData.map((data) => data.label.toUpperCase()),
        datasets: [
          {
            label: "Revenue (in Rs.)",
            data: graphData.map((data) => data.value),
            backgroundColor: "#2563eb99",
            borderRadius: 4,
          },
        ],
      }}
    />
  );
}
