// src/app/(admin)/dashboard/page.tsx
import React from "react";
import Stats from "../components/stats";
import QuickActions from "../components/quickactions";
import RecentOrders from "../components/recentOrders";
import TopProducts from "../components/topProducts";
import Alerts from "../components/alert";
import SalesChartServer from "../components/SalesChartServer";
import Sidebar from "../components/sidebar";
import MobileNav from "../components/mobileNav";

export default function DashboardPage() {
  return (
    <div className="h-full bg-gray-900 text-gray-100">
      <Sidebar />
      <MobileNav />
      <main className="py-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
          <div className="mb-8">
            <Stats />
          </div>
          <QuickActions type="dashboard" />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentOrders />
            <TopProducts />
          </div>
          <SalesChartServer />
          <Alerts />
        </div>
      </main>
    </div>
  );
}
