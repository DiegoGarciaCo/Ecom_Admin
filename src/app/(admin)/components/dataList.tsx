"use client";
import { Category } from "@/lib/definitions/categories";
import { customer } from "@/lib/definitions/customers";
import { Order } from "@/lib/definitions/dashboard";
import {
  NullableBoolean,
  NullableDate,
  NullableString,
} from "@/lib/definitions/nullable";
import { Product } from "@/lib/definitions/products";
import { Promotion } from "@/lib/definitions/promotions";
import React, { useState } from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  onHeaderClick?: () => void;
}

export interface Filter {
  key: string;
  options: string[];
}

interface DataListProps<
  T extends Product | Category | Order | Promotion | customer
> {
  type: "product" | "category" | "order" | "promotion" | "customer";
  data: T[];
  columns: Column<T>[];
  filters?: Filter[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onRowClick?: (item: T) => void;
}

export default function DataList<
  T extends Product | Category | Order | Promotion | customer
>({
  type,
  data,
  columns,
  filters = [],
  onEdit,
  onDelete,
  onRowClick,
}: DataListProps<T>) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<
    Record<string, string | null>
  >({});

  const getDisplayName = (item: T): string => {
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

  const filteredData = data.filter((item) => {
    const matchesSearch = getDisplayName(item)
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilters = filters.every((f) => {
      const filterValue = filterValues[f.key];
      if (!filterValue) return true;
      const itemValue = item[f.key as keyof T];
      if (typeof itemValue === "string" || typeof itemValue === "number") {
        return String(itemValue) === filterValue;
      }
      if (itemValue && typeof itemValue === "object") {
        if ("String" in itemValue && "Valid" in itemValue) {
          return (itemValue as NullableString).Valid
            ? (itemValue as NullableString).String === filterValue
            : false;
        }
        if ("Int32" in itemValue && "Valid" in itemValue) {
          return (itemValue as { Int32: number; Valid: boolean }).Valid
            ? String((itemValue as { Int32: number; Valid: boolean }).Int32) ===
                filterValue
            : false;
        }
      }
      return false;
    });
    return matchesSearch && matchesFilters;
  });

  console.log("Filtered Data:", filteredData);

  return (
    <div className="mt-8 bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder={`Search ${type}s...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 rounded-md bg-gray-700 border border-gray-600 px-4 py-2 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filterValues[filter.key] || ""}
            onChange={(e) =>
              setFilterValues({
                ...filterValues,
                [filter.key]: e.target.value || null,
              })
            }
            className="w-full sm:w-1/4 rounded-md bg-gray-700 border border-gray-600 px-4 py-2 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">
              All {filter.key.charAt(0).toUpperCase() + filter.key.slice(1)}
            </option>
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            {columns.map((col) => (
              <th
                key={col.key as string}
                className={`py-2 ${
                  col.onHeaderClick ? "cursor-pointer hover:text-gray-200" : ""
                }`}
                onClick={col.onHeaderClick}
              >
                {col.label}
              </th>
            ))}
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr
              key={item.ID || item.ID}
              className="border-t border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={col.key as string} className="py-2 text-gray-300">
                  {col.render
                    ? col.render(item)
                    : (() => {
                        const value = item[col.key as keyof T];
                        if (value === undefined || value === null) return "N/A";
                        if (
                          typeof value === "string" ||
                          typeof value === "number"
                        )
                          return String(value);
                        if (value && typeof value === "object") {
                          if ("String" in value && "Valid" in value) {
                            return (value as NullableString).Valid
                              ? (value as NullableString).String
                              : "N/A";
                          }
                          if ("Time" in value && "Valid" in value) {
                            return (value as NullableDate).Valid
                              ? (value as NullableDate).Time
                              : "N/A";
                          }
                          if ("Boolean" in value && "Valid" in value) {
                            return (value as NullableBoolean).Valid
                              ? String((value as NullableBoolean).Boolean)
                              : "N/A";
                          }
                          if ("Int32" in value && "Valid" in value) {
                            return (value as { Int32: number; Valid: boolean })
                              .Valid
                              ? String(
                                  (value as { Int32: number; Valid: boolean })
                                    .Int32
                                )
                              : "N/A";
                          }
                        }
                        return "N/A";
                      })()}
                </td>
              ))}
              <td className="py-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="text-blue-400 hover:text-blue-300 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredData.length === 0 && (
        <p className="text-gray-400 text-center mt-4">No {type}s found.</p>
      )}
    </div>
  );
}
