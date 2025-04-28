// src/app/(admin)/components/salesChartClient.tsx
"use client";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DashboardStats } from "@/lib/definitions/dashboard";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const, labels: { color: "#FFFFFF" } },
    title: { display: true, color: "#FFFFFF" },
  },
  scales: {
    y: { beginAtZero: true, ticks: { color: "#D1D5DB" } },
    x: { ticks: { color: "#D1D5DB" } },
  },
};

interface SalesChartClientProps {
  initialData: DashboardStats;
}

export default function SalesChartClient({
  initialData,
}: SalesChartClientProps) {
  const [chartType, setChartType] = useState<
    "sales" | "orders" | "revenuePerProduct"
  >("sales");

  const chartData = {
    sales: {
      labels: initialData.salesLast6Months.map((item) => item.month),
      datasets: [
        {
          label: "Sales ($)",
          data: initialData.salesLast6Months.map((item) => item.sales),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true,
        },
      ],
    },
    orders: {
      labels: initialData.ordersLast6Months.map((item) => item.month),
      datasets: [
        {
          label: "Orders",
          data: initialData.ordersLast6Months.map((item) => item.orders),
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          fill: true,
        },
      ],
    },
    revenuePerProduct: {
      labels: initialData.revenuePerProduct.map((item) => item.productName),
      datasets: [
        {
          label: "Revenue per Product ($)",
          data: initialData.revenuePerProduct.map((item) => item.revenue),
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.2)",
          fill: true,
        },
      ],
    },
  };

  const getChartTitle = () => {
    switch (chartType) {
      case "sales":
        return "Sales Over Last 6 Months";
      case "orders":
        return "Orders Over Last 6 Months";
      case "revenuePerProduct":
        return "Revenue by Product";
      default:
        return "Chart";
    }
  };

  return (
    <div className="mt-8 bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setChartType("sales")}
          className={`px-4 py-2 rounded-md text-sm font-semibold ${
            chartType === "sales"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Sales
        </button>
        <button
          onClick={() => setChartType("orders")}
          className={`px-4 py-2 rounded-md text-sm font-semibold ${
            chartType === "orders"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setChartType("revenuePerProduct")}
          className={`px-4 py-2 rounded-md text-sm font-semibold ${
            chartType === "revenuePerProduct"
              ? "bg-yellow-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Revenue per Product
        </button>
      </div>
      <Line
        data={chartData[chartType]}
        options={{
          ...options,
          plugins: {
            ...options.plugins,
            title: { ...options.plugins.title, text: getChartTitle() },
          },
        }}
      />
    </div>
  );
}
