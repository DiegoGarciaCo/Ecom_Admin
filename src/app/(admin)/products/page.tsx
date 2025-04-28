// src/app/(admin)/products/page.tsx
import React from "react";
import Sidebar from "../components/sidebar";
import MobileNav from "../components/mobileNav";
import { Product } from "@/lib/definitions/products";
import { getProducts } from "@/lib/data/productData";
import ProductsClient from "../components/productsClient";
import { getCategories } from "@/lib/data/categories";

// Normalize product data to match the expected Product interface
function normalizeProduct(product: Product): Product {
  return {
    ID: product.ID || "",
    Name: product.Name || "Unnamed Product",
    BasePrice: product.BasePrice || "0",
    CurrentPrice: product.CurrentPrice || "0",
    CategoryID: product.CategoryID || "",
    CategoryName: product.CategoryName || "Uncategorized",
    Description: product.Description || { String: "", Valid: false },
    ImageUrl: product.ImageUrl || { String: "/girlsBoots.jpg", Valid: false },
    CreatedAt: product.CreatedAt || { Time: "", Valid: false },
    UpdatedAt: product.UpdatedAt || { Time: "", Valid: false },
    Stock: product.Stock || { Int32: 0, Valid: false },
    Weight: product.Weight || { String: "", Valid: false },
  };
}

export default async function ProductsPage() {
  let products: Product[] = [];
  let categories: any[] = []; // Adjust type if you have a Category interface

  try {
    const productsData = await getProducts();
    console.log("Fetched Products:", productsData);
    console.log("First Product:", productsData[0]);

    products = Array.isArray(productsData)
      ? productsData.map(normalizeProduct)
      : [];
    console.log("Normalized Products:", products);
    console.log("First Normalized Product:", products[0]);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    products = [];
  }

  try {
    const categoriesData = await getCategories();
    categories = Array.isArray(categoriesData) ? categoriesData : [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    categories = [];
  }

  return (
    <div className="flex min-h-screen w-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileNav />
        <main className="flex-1 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white mb-8">Products</h1>
            <ProductsClient
              products={products}
              initialCategories={categories}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
