// src/app/(admin)/components/topproducts.tsx
import { getTopProducts } from "@/lib/data/dashboardData";
import { ProductSales } from "@/lib/definitions/dashboard";
import React from "react";

export default async function TopProducts() {
  let productsData: ProductSales[];
  try {
    productsData = await getTopProducts();
  } catch (error) {
    console.error("Failed to load top products:", error);
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Top Products</h2>
        <div className="text-red-500">Failed to load top products</div>
      </div>
    );
  }

  const products = productsData
    ? productsData.map((product) => ({
        name: product.Name,
        sales: product.Sales,
        revenue: product.Revenue,
      }))
    : [];

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Top Products</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th className="py-2">Product</th>
            <th className="py-2">Sales</th>
            <th className="py-2">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.name} className="border-t border-gray-700">
              <td className="py-2 text-gray-300">{product.name}</td>
              <td className="py-2 text-gray-300">{product.sales}</td>
              <td className="py-2 text-gray-300">{product.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
