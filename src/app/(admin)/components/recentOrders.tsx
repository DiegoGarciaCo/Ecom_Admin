// src/app/(admin)/components/recentorders.tsx
import React from "react";
import Link from "next/link";
import { getRecentOrders } from "@/lib/data/dashboardData";
import { Order } from "@/lib/definitions/dashboard";

export default async function RecentOrders() {
  let ordersData: Order[];
  try {
    ordersData = await getRecentOrders();
  } catch (error) {
    console.error("Failed to load recent orders:", error);
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
        <div className="text-red-500">Failed to load recent orders</div>
      </div>
    );
  }

  const orders = ordersData
    ? ordersData.map((order) => ({
        id: order.ID,
        customer: order.Customer,
        date: new Date(order.Date.Time).toLocaleDateString(),
        total: `$${order.Total}`,
        status: order.Status.charAt(0).toUpperCase() + order.Status.slice(1),
      }))
    : [];

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th className="py-2">Order ID</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Date</th>
            <th className="py-2">Total</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-gray-700">
              <td className="py-2">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {order.id.slice(0, 5)}
                </Link>
              </td>
              <td className="py-2 text-gray-300">{order.customer}</td>
              <td className="py-2 text-gray-300">{order.date}</td>
              <td className="py-2 text-gray-300">{order.total}</td>
              <td className="py-2 text-gray-300">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
