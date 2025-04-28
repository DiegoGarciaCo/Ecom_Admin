// src/app/(admin)/customers/customersClient.tsx
"use client";
import React, { useState } from "react";
import DataList, { Column, Filter } from "../components/dataList";
import DeleteConfirmation from "../components/deleteConfirmation";
import DataModal, { Field } from "../components/dataModal";
import MobileNav from "../components/mobileNav";
import { customer } from "@/lib/definitions/customers";

interface CustomersClientProps {
  initialCustomers: customer[];
}

export default function CustomersClient({
  initialCustomers,
}: CustomersClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<customer | null>(null);

  // Normalize initial customers data
  const customers = initialCustomers.map((user) => ({
    ...user,
    id: user.ID || "",
    name: `${user.FirstName?.String || ""} ${user.LastName?.String || ""}`,
    email: user.Email?.String || "",
    phone: user.Phone?.String || "",
    orderCount: 0, // Placeholder; fetch real data if available
    notes: "",
  })) as customer[];

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (customer: customer) => {
    // Placeholder for save logic; implement create/update API calls here
    console.log("Saving customer:", customer);
    setIsModalOpen(false);
    // Optionally: window.location.reload() to refresh data after save
  };

  const handleDeleteCustomer = (customer: customer) => {
    setDeleteCustomer(customer);
  };

  const confirmDelete = () => {
    if (deleteCustomer) {
      // Placeholder for delete logic; implement delete API call here
      console.log("Deleting customer:", deleteCustomer);
      setDeleteCustomer(null);
      // Optionally: window.location.reload() to refresh data after delete
    }
  };

  const columns: Column<customer>[] = [
    {
      key: "id",
      label: "ID",
      render: (item) => item.ID?.slice(0, 5) || "N/A",
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "orderCount", label: "Orders" },
  ];

  const filters: Filter[] = [
    {
      key: "orderCount",
      options: ["0", "1-2", "3+"], // Simplified ranges for demo
    },
  ];

  const fields: Field<customer>[] = [
    { key: "FirstName", label: "First Name", type: "text", required: true },
    { key: "LastName", label: "Last Name", type: "text", required: true },
    { key: "Email", label: "Email", type: "text", required: true },
    { key: "Phone", label: "Phone", type: "text", required: true },
    {
      key: "Password",
      label: "Password",
      type: "text",
      required: !editingCustomer,
    }, // Required only for new customers
  ];

  return (
    <>
      <MobileNav />
      <DataList
        type="customer"
        data={customers}
        columns={columns}
        filters={filters}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
      />
      {isModalOpen && (
        <DataModal
          type="customer"
          item={editingCustomer}
          fields={fields}
          onSave={handleSaveCustomer}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {deleteCustomer && (
        <DeleteConfirmation
          type="customer"
          item={deleteCustomer}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteCustomer(null)}
        />
      )}
    </>
  );
}
