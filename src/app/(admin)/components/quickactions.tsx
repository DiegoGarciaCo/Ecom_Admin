"use client";
import React from "react";
import Link from "next/link";

interface QuickActionsProps {
  type: "dashboard" | "product" | "category" | "promotion" | "order"; // Add "promotion" and "order"
  onAdd?: () => void; // Optional for non-dashboard pages
}

export default function QuickActions({ type, onAdd }: QuickActionsProps) {
  return (
    <div className="mb-8">
      {type === "dashboard" ? (
        <div className="flex flex-wrap gap-4">
          <Link
            href="/products"
            onClick={onAdd}
            className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 transition-colors"
          >
            Add Product
          </Link>
          <Link
            href="/categories"
            onClick={onAdd}
            className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 transition-colors"
          >
            Add Category
          </Link>
          <Link
            href="/promotions"
            onClick={onAdd}
            className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 transition-colors"
          >
            Add Promotion
          </Link>
          <Link
            href="/orders"
            className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      ) : (
        <button
          onClick={onAdd}
          className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 transition-colors"
        >
          Add New {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      )}
    </div>
  );
}
