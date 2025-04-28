// src/app/(admin)/components/stats.tsx
import { getStats } from "@/lib/data/dashboardData";
import { statData } from "@/lib/definitions/dashboard";
import React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default async function Stats() {
  const data: statData = await getStats();

  const stats = data
    ? [
        {
          name: "Total Sales",
          value: `$${data.TotalSales.toFixed(2)}`,
          change: `${data.SalesChange.toFixed(2)}%`,
          changeType: data.SalesChange > 0 ? "positive" : "negative",
        },
        {
          name: "Orders This Month",
          value: data.OrdersThisMonth.toString(),
          change: `${data.OrdersChange.toFixed(2)}%`,
          changeType: data.OrdersChange > 0 ? "positive" : "negative",
        },
        {
          name: "New Subscribers",
          value: data.NewSubscribers.toString(),
          change: `${data.SubscribersChange.toFixed(2)}%`,
          changeType: data.SubscribersChange > 0 ? "positive" : "negative",
        },
        {
          name: "New Customers",
          value: data.NewCustomers.toString(),
          change: `${data.CustomersChange.toFixed(2)}%`,
          changeType: data.CustomersChange > 0 ? "positive" : "negative",
        },
      ]
    : [];

  return (
    <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-700/50 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-gray-800 px-4 py-10 sm:px-6 xl:px-8"
        >
          <dt className="text-sm font-medium text-gray-400">{stat.name}</dt>
          <dd
            className={classNames(
              stat.changeType === "negative"
                ? "text-red-500"
                : "text-green-500",
              "text-xs font-medium"
            )}
          >
            {stat.change}
          </dd>
          <dd className="w-full flex-none text-3xl font-medium tracking-tight text-white">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
