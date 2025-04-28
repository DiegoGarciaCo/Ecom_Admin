"use client";
import { Column, Filter } from "../components/dataList";
import { Field } from "../components/dataModal";
import { Product } from "@/lib/definitions/products";
import Image from "next/image";

export const getColumns = (): Column<Product>[] => [
  { key: "ID", label: "ID", render: (item) => item.ID?.slice(0, 5) || "N/A" },
  {
    key: "ImageUrl",
    label: "Image",
    render: (item) => (
      <div className="flex gap-2">
        <Image
          src={item.ImageUrl?.String || "/girlsBoots.jpg"}
          alt={`${item.Name || "Product"} image`}
          width={40}
          height={40}
          className="rounded object-cover"
        />
      </div>
    ),
  },
  { key: "Name", label: "Name" },
  {
    key: "BasePrice",
    label: "Base Price",
    render: (item) => `$${item.BasePrice || "0"}`,
  },
  {
    key: "CurrentPrice",
    label: "Current Price",
    render: (item) => `$${item.CurrentPrice || "0"}`,
  },
  { key: "Stock", label: "Stock", render: (item) => item.Stock?.Int32 || 0 },
  {
    key: "Weight",
    label: "Weight",
    render: (item) => (item.Weight?.Valid ? item.Weight?.String : "N/A"),
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

export const getFilters = (products: Product[]): Filter[] => [
  {
    key: "categories",
    options: Array.from(
      new Set(products.map((p) => p.CategoryName || "Unknown"))
    ),
  },
];

export const getFields = (isEditMode: boolean = false): Field<Product>[] => [
  { key: "Name", label: "Name", type: "text", required: true },
  { key: "BasePrice", label: "Base Price ($)", type: "text", required: true },
  {
    key: "CurrentPrice",
    label: "Current Price ($)",
    type: "text",
    required: true,
  },
  {
    key: "Description",
    label: "Description",
    type: "textarea",
    required: true,
  },
  { key: "Weight", label: "Weight", type: "text", required: true },
  isEditMode
    ? { key: "ImageUrl", label: "Image URL", type: "text", required: true }
    : { key: "Images", label: "Product Images", type: "file", required: true },
  { key: "Stock", label: "Stock", type: "number", required: true },
];
