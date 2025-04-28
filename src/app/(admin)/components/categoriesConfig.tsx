// src/app/(admin)/categories/categoriesConfig.tsx
"use client";
import { Column } from "../components/dataList";
import { Field } from "../components/dataModal";
import { Category } from "@/lib/definitions/categories";
import Image from "next/image";

export const getColumns = (): Column<Category>[] => [
  { key: "ID", label: "ID", render: (item) => item.ID?.slice(0, 5) || "N/A" },
  {
    key: "ImageUrl",
    label: "Image",
    render: (item) =>
      item.ImageUrl?.Valid ? (
        <Image
          src={item.ImageUrl.String || "/default-category.jpg"}
          alt={item.Name || "Category"}
          width={40}
          height={40}
          className="rounded"
        />
      ) : (
        <span className="text-gray-500">No Image</span>
      ),
  },
  { key: "Name", label: "Name" },
  {
    key: "Description",
    label: "Description",
    render: (item) =>
      item.Description?.Valid ? item.Description.String : "N/A",
  },
  {
    key: "CreatedAt",
    label: "Created On",
    render: (item) =>
      item.CreatedAt?.Time
        ? new Date(item.CreatedAt.Time).toLocaleDateString()
        : "N/A",
  },
];

export const getFields = (
  isEditMode: boolean = false,
  parentCategories: Category[] = []
): Field<Category>[] => [
  { key: "Name", label: "Name", type: "text", required: true },
  { key: "Slug", label: "Slug", type: "text", required: true },
  { key: "IsGenderSpecific", label: "Gender Specific", type: "checkbox" },
  {
    key: "Description",
    label: "Description",
    type: "textarea",
    required: true,
  },
  {
    key: "parentID",
    label: "Parent Category",
    type: "select",
    options: [
      { value: "", label: "None" },
      ...parentCategories.map((cat) => ({
        value: cat.ID || "",
        label: cat.Name || "Unnamed Category",
      })),
    ],
  },
  isEditMode
    ? { key: "ImageFile", label: "Update Image (optional)", type: "file" }
    : {
        key: "ImageFile",
        label: "Category Image",
        type: "file",
        required: true,
      },
];
