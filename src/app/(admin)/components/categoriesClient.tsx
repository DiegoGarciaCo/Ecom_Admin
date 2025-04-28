// src/app/(admin)/categories/categoriesClient.tsx
"use client";
import React, { useState } from "react";
import DataList from "../components/dataList";
import DataModal from "../components/dataModal";
import DeleteConfirmation from "../components/deleteConfirmation";
import { Category } from "@/lib/definitions/categories";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/data/categories";
import QuickActions from "../components/quickactions";
import { getColumns, getFields } from "./categoriesConfig";

interface CategoriesClientProps {
  categories: Category[];
}

export default function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const columns = getColumns();
  const fields = getFields(!!editingCategory, categories); // Pass isEditMode

  const handleAddCategory = async (category: Category) => {
    try {
      await createCategory(category);
      window.location.reload(); // Refresh to reflect changes
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add category:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      await updateCategory(category);
      window.location.reload(); // Refresh to reflect changes
      setEditingCategory(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.ID || "");
      window.location.reload(); // Refresh to reflect changes
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleAddClick = () => {
    setEditingCategory(null); // Ensure we're in "add" mode
    setIsModalOpen(true);
  };

  return (
    <>
      <QuickActions type="category" onAdd={handleAddClick} />
      <DataList
        type="category"
        data={categories}
        columns={columns}
        onEdit={(category) => {
          setEditingCategory(category);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteCategory}
      />
      {isModalOpen && (
        <DataModal
          type="category"
          item={editingCategory}
          fields={fields}
          onSave={editingCategory ? handleUpdateCategory : handleAddCategory}
          onClose={() => {
            setEditingCategory(null);
            setIsModalOpen(false);
          }}
        />
      )}
      {categoryToDelete && (
        <DeleteConfirmation
          type="category"
          item={categoryToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setCategoryToDelete(null)}
        />
      )}
    </>
  );
}
