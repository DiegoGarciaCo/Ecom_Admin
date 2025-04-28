// src/app/(admin)/components/salesChartServer.tsx
import React from "react";
import SalesChartClient from "./SalesChartClient";
import { DashboardStats } from "@/lib/definitions/dashboard";
import { getSalesChartData } from "@/lib/data/dashboardData";

export default async function SalesChartServer() {
  let data: DashboardStats;
  try {
    data = await getSalesChartData();
    console.log(data);
  } catch (error) {
    console.error("Failed to load sales chart data:", error);
    return (
      <div className="mt-8 bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Sales Chart</h2>
        <div className="text-red-500">Failed to load chart data</div>
      </div>
    );
  }

  return <SalesChartClient initialData={data} />;
}
