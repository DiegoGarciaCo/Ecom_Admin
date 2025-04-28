// src/app/(admin)/orders/page.tsx
import { getOrders } from "@/lib/data/orderData";
import Sidebar from "../components/sidebar";
import OrdersClient from "../components/ordersClient";

export default async function OrdersPage() {
  let ordersData;
  try {
    ordersData = await getOrders();
  } catch (error) {
    console.error("Failed to fetch orders in server component:", error);
    ordersData = [];
  }

  return (
    <div className="h-full bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="py-10 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Orders</h1>
          <OrdersClient initialOrders={ordersData} />
        </div>
      </main>
    </div>
  );
}
