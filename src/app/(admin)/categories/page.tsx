// src/app/(admin)/categories/page.tsx
import React from "react";
import Sidebar from "../components/sidebar";
import MobileNav from "../components/mobileNav";
import { Category } from "@/lib/definitions/categories";
import { getCategories } from "@/lib/data/categories";
import CategoriesClient from "../components/categoriesClient";

// Normalize category data to match the expected Category interface
function normalizeCategory(category: Category): Category {
  return {
    ID: category.ID || "",
    Name: category.Name || "Unnamed Category",
    Slug: category.Slug || "",
    parentID: category.parentID || { String: "", Valid: false },
    IsGenderSpecific: category.IsGenderSpecific || {
      Boolean: false,
      Valid: false,
    },
    ParentName: category.ParentName || { String: "", Valid: false },
    ParentSlug: category.ParentSlug || { String: "", Valid: false },
    Description: category.Description || { String: "", Valid: false },
    ImageUrl: category.ImageUrl || {
      String: "/default-category.jpg",
      Valid: false,
    },
    CreatedAt: category.CreatedAt || { Time: "", Valid: false },
    UpdatedAt: category.UpdatedAt || { Time: "", Valid: false },
  };
}

export default async function CategoriesPage() {
  let categories: Category[] = [];

  try {
    const categoriesData = await getCategories();
    console.log("Fetched Categories:", categoriesData);
    console.log("First Category:", categoriesData[0]);

    categories = Array.isArray(categoriesData)
      ? categoriesData.map(normalizeCategory)
      : [];
    console.log("Normalized Categories:", categories);
    console.log("First Normalized Category:", categories[0]);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    categories = [];
  }

  return (
    <div className="flex min-h-screen w-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <MobileNav />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white mb-8">Categories</h1>
            <CategoriesClient categories={categories} />
          </div>
        </main>
      </div>
    </div>
  );
}
