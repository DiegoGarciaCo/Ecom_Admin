"use client";
import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Category } from "@/lib/definitions/categories";

interface AssignCategoriesModalProps {
  productId: string;
  categories: Category[];
  onClose: () => void;
  onSave: (productId: string, categoryIDs: string[]) => void;
}

export default function AssignCategoriesModal({
  productId,
  categories,
  onClose,
  onSave,
}: AssignCategoriesModalProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const handleCheckboxChange = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(productId, selectedCategoryIds);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-gray-800 rounded-lg p-6 text-gray-100 max-h-[80vh] flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-4">
            Assign Categories to Product
          </h2>
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.ID} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.ID}`}
                    value={category.ID}
                    checked={selectedCategoryIds.includes(category.ID || "")}
                    onChange={() => handleCheckboxChange(category.ID || "")}
                    className="rounded bg-gray-700 border border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`category-${category.ID}`}
                    className="ml-2 text-gray-300"
                  >
                    {category.Name}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
