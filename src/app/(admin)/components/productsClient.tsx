"use client";
import React, { useState } from "react";
import DataList from "../components/dataList";
import DataModal from "../components/dataModal";
import DeleteConfirmation from "../components/deleteConfirmation";
import { Product } from "@/lib/definitions/products";
import { Category } from "@/lib/definitions/categories";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/data/productData";
import QuickActions from "../components/quickactions";
import { getColumns, getFields, getFilters } from "./productsConfig";
import AssignCategoriesModal from "./AssignCategoriesModal";

interface ProductsClientProps {
  products: Product[];
  initialCategories: Category[];
}

export default function ProductsClient({
  products,
  initialCategories,
}: ProductsClientProps) {
  console.log("Received Products in ProductsClient:", products);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedProductForCategories, setSelectedProductForCategories] =
    useState<Product | null>(null);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  const columns = getColumns();
  const filters = getFilters(products);
  const fields = getFields(!!editingProduct);

  const handleAddProduct = async (product: Product) => {
    try {
      const newProduct = await createProduct(product);
      window.location.reload();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      await updateProduct(product);
      window.location.reload();
      setEditingProduct(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.ID || "");
      window.location.reload();
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleRowClick = (product: Product) => {
    setSelectedProductForCategories(product);
    setIsCategoriesModalOpen(true);
  };

  const handleAssignCategories = async (
    productId: string,
    categoryIDs: string[]
  ) => {
    const payload = {
      categoryIDs: categoryIDs,
    };
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/categories/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        console.log("productId", productId);
        throw new Error("Failed to assign categories");
      }
      console.log("Categories assigned successfully:", categoryIDs);
      window.location.reload();
    } catch (error) {
      console.error("Failed to assign categories:", error);
      alert("Failed to assign categories. Please try again.");
    }
  };

  return (
    <>
      <QuickActions type="product" onAdd={handleAddClick} />
      <DataList
        type="product"
        data={products}
        columns={columns}
        filters={filters}
        onEdit={(product) => {
          setEditingProduct(product);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteProduct}
        onRowClick={handleRowClick}
      />
      {isModalOpen && (
        <DataModal
          type="product"
          item={editingProduct}
          fields={fields}
          onSave={editingProduct ? handleUpdateProduct : handleAddProduct}
          onClose={() => {
            setEditingProduct(null);
            setIsModalOpen(false);
          }}
        />
      )}
      {isCategoriesModalOpen && selectedProductForCategories && (
        <AssignCategoriesModal
          productId={selectedProductForCategories.ID || ""}
          categories={initialCategories}
          onClose={() => {
            setSelectedProductForCategories(null);
            setIsCategoriesModalOpen(false);
          }}
          onSave={handleAssignCategories}
        />
      )}
      {productToDelete && (
        <DeleteConfirmation
          type="product"
          item={productToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setProductToDelete(null)}
        />
      )}
    </>
  );
}
