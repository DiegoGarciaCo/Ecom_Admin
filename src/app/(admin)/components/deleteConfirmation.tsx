// src/app/(admin)/components/deleteConfirmation.tsx
"use client";
import React from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Product } from "@/lib/definitions/products";
import { Category } from "@/lib/definitions/categories";
import { Order } from "@/lib/definitions/dashboard";
import { customer } from "@/lib/definitions/customers";
import { Promotion } from "@/lib/definitions/promotions";

// Generic interface for props
interface DeleteConfirmationProps<
  T extends Product | Category | Order | Promotion | customer
> {
  type: "product" | "category" | "order" | "promotion" | "customer";
  item: T;
  onConfirm: () => void;
  onCancel: () => void;
}

// Use proper naming convention (DeleteConfirmation instead of deleteConfirmation)
export default function DeleteConfirmation<
  T extends Product | Category | Order | Promotion | customer
>({ type, item, onConfirm, onCancel }: DeleteConfirmationProps<T>) {
  // Helper to get the display name based on type
  const getDisplayName = (): string => {
    switch (type) {
      case "product":
        return (item as Product).Name || "Unnamed Product";
      case "category":
        return (item as Category).Name || "Unnamed Category";
      case "order":
        return (item as Order).Customer || "Unnamed Order";
      case "promotion":
        return (item as Promotion).Name || "Unnamed Promotion";
      case "customer":
        return (
          `${(item as customer).FirstName || ""} ${
            (item as customer).LastName || ""
          }`.trim() || "Unnamed Customer"
        );
      default:
        return "Unknown Item";
    }
  };

  // Helper to get additional info (e.g., productCount)
  const getAdditionalInfo = () => {
    if (type === "category" && "productCount" in item) {
      const productCount = (item as any).productCount; // Assuming Category might have this from API
      return productCount !== undefined ? (
        <>
          {" "}
          This will affect {productCount} product{productCount !== 1 ? "s" : ""}
          .
        </>
      ) : null;
    }
    return null;
  };

  return (
    <Dialog open={true} onClose={onCancel} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-gray-800 rounded-lg p-6 text-gray-100">
          <h2 className="text-xl font-semibold text-white mb-4">
            Confirm Deletion
          </h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-medium text-white">{getDisplayName()}</span>?
            {getAdditionalInfo()}
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
