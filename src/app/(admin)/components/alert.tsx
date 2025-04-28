// src/app/(admin)/components/alerts.tsx
import { getAlerts } from "@/lib/data/dashboardData";
import { Notification } from "@/lib/definitions/dashboard";
import React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default async function Alerts() {
  let alertsData: Notification[];
  try {
    alertsData = await getAlerts();
  } catch (error) {
    console.error("Failed to load alerts:", error);
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Alerts</h2>
        <div className="text-red-500">Failed to load alerts</div>
      </div>
    );
  }

  const alerts = alertsData
    ? alertsData.map((alert) => ({
        message: alert.Message,
        type: alert.Type,
      }))
    : [];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">Alerts</h2>
      <ul className="space-y-4">
        {alerts.map((alert, index) => (
          <li
            key={index}
            className={classNames(
              alert.type === "error"
                ? "bg-red-900 text-red-200"
                : alert.type === "warning"
                ? "bg-yellow-900 text-yellow-200"
                : "bg-green-900 text-green-200",
              "rounded-md p-4"
            )}
          >
            {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
