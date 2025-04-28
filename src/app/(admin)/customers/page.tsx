// src/app/(admin)/customers/page.tsx
import Sidebar from "../components/sidebar";
import { getCustomers } from "@/lib/data/customers";
import MobileNav from "../components/mobileNav";
import CustomersClient from "../components/customersClient";

export default async function CustomersPage() {
  let customersData;
  try {
    customersData = await getCustomers();
  } catch (error) {
    console.error("Failed to fetch customers in server component:", error);
    customersData = [];
  }

  return (
    <div className="h-full bg-gray-900 text-gray-100">
      <Sidebar />
      <MobileNav />
      <main className="py-10 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Customers</h1>
          <CustomersClient initialCustomers={customersData} />
        </div>
      </main>
    </div>
  );
}
