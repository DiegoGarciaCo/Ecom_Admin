"use client";
import React, { useEffect, useState } from "react";
import { Column, Filter } from "../components/dataList";
import DataModal, { Field } from "../components/dataModal";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobileNav";
import DataList from "../components/dataList";
import DeleteConfirmation from "../components/deleteConfirmation";
import QuickActions from "../components/quickactions";
import { useAuth } from "@/lib/authContext";

type Promotion = {
  id: string;
  name: string;
  description: string;
  discountPercentage?: string | null;
  discountAmount?: string | null;
  bundlePrice?: string | null;
  productId?: string | null;
  categoryId?: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productName?: string;
  categoryName?: string;
};

type PromotionType = "percentage" | "fixed" | "bundle";

export default function PromotionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "SPRING20",
      description: "20% off spring collection",
      discountPercentage: "20.00",
      discountAmount: null,
      bundlePrice: null,
      productId: null,
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      startDate: "2025-03-01T00:00:00Z",
      endDate: "2025-03-31T23:59:59Z",
      isActive: true,
      createdAt: "2025-02-28T10:00:00Z",
      updatedAt: "2025-02-28T10:00:00Z",
      productName: undefined,
      categoryName: "Men",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "FLASH10",
      description: "$10 off select boots",
      discountPercentage: null,
      discountAmount: "10.00",
      bundlePrice: null,
      productId: "1",
      categoryId: null,
      startDate: "2025-03-06T00:00:00Z",
      endDate: "2025-03-07T23:59:59Z",
      isActive: false,
      createdAt: "2025-03-05T09:00:00Z",
      updatedAt: "2025-03-05T09:00:00Z",
      productName: "Men’s Classic Boot",
      categoryName: undefined,
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "BUNDLE50",
      description: "Bundle deal for kids",
      discountPercentage: null,
      discountAmount: null,
      bundlePrice: "50.00",
      productId: null,
      categoryId: "550e8400-e29b-41d4-a716-446655440002",
      startDate: "2025-03-01T00:00:00Z",
      endDate: "2025-03-15T23:59:59Z",
      isActive: true,
      createdAt: "2025-02-27T14:00:00Z",
      updatedAt: "2025-02-27T14:00:00Z",
      productName: undefined,
      categoryName: "Kids",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );
  const [deletePromotion, setDeletePromotion] = useState<Promotion | null>(
    null
  );
  const [selectedPromotionType, setSelectedPromotionType] =
    useState<PromotionType | null>(null);
  const { checkAuth, isLoggedIn, isChecking } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    window.location.replace("/login");
  }

  const handleAddPromotion = (type: PromotionType) => {
    setSelectedPromotionType(type);
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setSelectedPromotionType(
      promotion.discountPercentage
        ? "percentage"
        : promotion.discountAmount
        ? "fixed"
        : "bundle"
    );
    setIsModalOpen(true);
  };

  const handleSavePromotion = async (promotion: Promotion) => {
    const url = editingPromotion
      ? `/api/promotions/${promotion.id}`
      : "/api/promotions";
    const method = editingPromotion ? "PUT" : "POST";

    const payload = {
      name: promotion.name,
      description: promotion.description,
      discount_percentage: promotion.discountPercentage || null,
      discount_amount: promotion.discountAmount || null,
      product_id: promotion.productId || null,
      category_id: promotion.categoryId || null,
      start_date: promotion.startDate,
      end_date: promotion.endDate,
      is_active: promotion.isActive === undefined ? true : promotion.isActive,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save promotion");

      const savedPromotion = await response.json();
      if (editingPromotion) {
        setPromotions(
          promotions.map((p) =>
            p.id === promotion.id
              ? {
                  ...savedPromotion,
                  productName: p.productName,
                  categoryName: p.categoryName,
                }
              : p
          )
        );
      } else {
        setPromotions([
          ...promotions,
          {
            ...savedPromotion,
            productName: undefined,
            categoryName: undefined,
          },
        ]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving promotion:", error);
      alert("Failed to save promotion");
    }
  };

  const handleDeletePromotion = (promotion: Promotion) => {
    setDeletePromotion(promotion);
  };

  const confirmDelete = async () => {
    if (deletePromotion) {
      try {
        const response = await fetch(`/api/promotions/${deletePromotion.id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete promotion");

        setPromotions(promotions.filter((p) => p.id !== deletePromotion.id));
        setDeletePromotion(null);
      } catch (error) {
        console.error("Error deleting promotion:", error);
        alert("Failed to delete promotion");
      }
    }
  };

  const columns: Column<Promotion>[] = [
    {
      key: "id",
      label: "ID",
      render: (item: Promotion) => item.id.slice(0, 5),
    },
    { key: "name", label: "Code" },
    {
      key: "discount",
      label: "Discount",
      render: (item: Promotion) =>
        item.discountPercentage
          ? `${item.discountPercentage}%`
          : item.discountAmount
          ? `$${item.discountAmount}`
          : item.bundlePrice
          ? `Bundle: $${item.bundlePrice}`
          : "N/A",
    },
    {
      key: "productName",
      label: "Product",
      render: (item: Promotion) => item.productName || "N/A",
    },
    {
      key: "categoryName",
      label: "Category",
      render: (item: Promotion) => item.categoryName || "N/A",
    },
    {
      key: "startDate",
      label: "Start Date",
      render: (item: Promotion) =>
        new Date(item.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      label: "End Date",
      render: (item: Promotion) => new Date(item.endDate).toLocaleDateString(),
    },
    {
      key: "isActive",
      label: "Status",
      render: (item: Promotion) => {
        const now = new Date();
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        return item.isActive && now >= start && now <= end
          ? "Active"
          : item.isActive
          ? "Inactive"
          : "Expired";
      },
    },
  ];

  const filters: Filter[] = [{ key: "isActive", options: ["true", "false"] }];

  const percentageFields: Field<Promotion>[] = [
    { key: "name", label: "Promotion Code", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea" },
    {
      key: "discountPercentage",
      label: "Discount Percentage (%)",
      type: "text",
      required: true,
    },
    { key: "productId", label: "Product ID", type: "text" },
    { key: "categoryId", label: "Category ID", type: "text" },
    { key: "startDate", label: "Start Date", type: "text", required: true },
    { key: "endDate", label: "End Date", type: "text", required: true },
    {
      key: "isActive",
      label: "Active",
      type: "select",
      options: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
    },
  ];

  const fixedFields: Field<Promotion>[] = [
    { key: "name", label: "Promotion Code", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea" },
    {
      key: "discountAmount",
      label: "Discount Amount ($)",
      type: "text",
      required: true,
    },
    { key: "productId", label: "Product ID", type: "text" },
    { key: "categoryId", label: "Category ID", type: "text" },
    { key: "startDate", label: "Start Date", type: "text", required: true },
    { key: "endDate", label: "End Date", type: "text", required: true },
    {
      key: "isActive",
      label: "Active",
      type: "select",
      options: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
    },
  ];

  const bundleFields: Field<Promotion>[] = [
    { key: "name", label: "Promotion Code", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea" },
    {
      key: "bundlePrice",
      label: "Bundle Price ($)",
      type: "text",
      required: true,
    },
    { key: "productId", label: "Product ID", type: "text" },
    { key: "categoryId", label: "Category ID", type: "text" },
    { key: "startDate", label: "Start Date", type: "text", required: true },
    { key: "endDate", label: "End Date", type: "text", required: true },
    {
      key: "isActive",
      label: "Active",
      type: "select",
      options: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
    },
  ];

  const getFields = (type: PromotionType): Field<Promotion>[] => {
    switch (type) {
      case "percentage":
        return percentageFields;
      case "fixed":
        return fixedFields;
      case "bundle":
        return bundleFields;
      default:
        return percentageFields; // Fallback
    }
  };

  return (
    <div className="h-full bg-gray-900 text-gray-100">
      <Sidebar />
      <MobileNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="py-10 lg:pl-72 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Promotions</h1>
          <div className="flex gap-4 mb-6">
            <QuickActions
              type="promotion"
              onAdd={() => handleAddPromotion("percentage")}
            />
            <div className="relative">
              <select
                onChange={(e) =>
                  handleAddPromotion(e.target.value as PromotionType)
                }
                className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 transition-colors appearance-none"
              >
                <option value="" disabled selected>
                  More Actions
                </option>
                <option value="fixed">Add Fixed Discount</option>
                <option value="bundle">Add Bundle Promotion</option>
              </select>
            </div>
          </div>
          <DataList
            type="promotion"
            data={promotions}
            columns={columns}
            filters={filters}
            onEdit={handleEditPromotion}
            onDelete={handleDeletePromotion}
          />
          {isModalOpen && selectedPromotionType && (
            <DataModal
              type="promotion"
              item={editingPromotion}
              fields={getFields(selectedPromotionType)}
              onSave={handleSavePromotion}
              onClose={() => setIsModalOpen(false)}
            />
          )}
          {deletePromotion && (
            <DeleteConfirmation
              type="promotion"
              item={deletePromotion}
              onConfirm={confirmDelete}
              onCancel={() => setDeletePromotion(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
