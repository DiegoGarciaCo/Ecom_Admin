// src/app/(admin)/orders/ordersClient.tsx
"use client";
import React, { useState } from "react";
import DeleteConfirmation from "../components/deleteConfirmation";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import DataList, { Column, Filter } from "../components/dataList";
import MobileNav from "../components/mobileNav";
import Skeleton from "../components/skeleton";
import DataModal, { Field } from "../components/dataModal";
import { Order } from "@/lib/definitions/orders";
import { deleteOrder, updateOrder } from "@/lib/data/orderData";
import { orderItems } from "@/lib/definitions/order-items";

interface OrdersClientProps {
  initialOrders: Order[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Normalize initial orders data
  const orders = initialOrders.map((order) => ({
    ...order,
    CreatedAt: {
      ...order.CreatedAt,
      Time: new Date(order.CreatedAt.Time).toISOString(),
    },
  }));

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleSaveOrder = async (order: Order) => {
    try {
      await updateOrder(order);
      setEditingOrder(null);
      setIsModalOpen(false);
      window.location.reload(); // Refresh to reflect changes
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order. Please try again.");
    }
  };

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrder(orderToDelete.ID);
      setOrderToDelete(null);
      window.location.reload(); // Refresh to reflect changes
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Failed to delete order. Please try again.");
    }
  };

  const handleSortByCreatedAt = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.CreatedAt.Time).getTime();
    const dateB = new Date(b.CreatedAt.Time).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const columns: Column<Order>[] = [
    {
      key: "id",
      label: "Order ID",
      render: (item: Order) => item.ID.slice(0, 5),
    },
    {
      key: "user_id",
      label: "User ID",
      render: (item: Order) => item.CustomerName.slice(0, 5),
    },
    { key: "name", label: "Customer" },
    {
      key: "totalAmount",
      label: "Total",
      render: (item: Order) => `$${item.TotalAmount}`,
    },
    { key: "status", label: "Status" },
    {
      key: "createdAt",
      label: `Created At ${sortOrder === "asc" ? "▲" : "▼"}`,
      render: (item: Order) =>
        item.CreatedAt.Valid
          ? new Date(item.CreatedAt.Time).toLocaleDateString()
          : "N/A",
      onHeaderClick: handleSortByCreatedAt,
    },
  ];

  const filters: Filter[] = [
    {
      key: "status",
      options: ["pending", "shipped", "delivered", "canceled"],
    },
  ];

  const fields: Field<Order>[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
      ],
      required: true,
    },
  ];

  // Mock order items data (replace with real fetch if needed)
  const isOrderItemsLoading = false; // Replace with actual loading state
  const orderItemsError = null; // Replace with actual error state
  const orderItemsData: orderItems[] = []; // Replace with actual data from getOrderItems

  return (
    <>
      <MobileNav />
      <DataList
        type="order"
        data={sortedOrders}
        columns={columns}
        filters={filters}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
        onRowClick={handleRowClick}
      />
      {isModalOpen && (
        <DataModal
          type="order"
          item={editingOrder}
          fields={fields}
          onSave={handleSaveOrder}
          onClose={() => {
            setEditingOrder(null);
            setIsModalOpen(false);
          }}
        />
      )}
      {orderToDelete && (
        <DeleteConfirmation
          type="order"
          item={orderToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setOrderToDelete(null)}
        />
      )}
      {selectedOrder && (
        <Dialog
          open={true}
          onClose={() => setSelectedOrder(null)}
          className="relative z-50"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md bg-gray-800 rounded-lg p-6 text-gray-100 overflow-y-auto max-h-[80vh]">
              <h2 className="text-xl font-semibold text-white mb-4">
                Order Details - {selectedOrder.ID.slice(0, 5)}
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-300">
                  Shipping Address
                </h3>
                <p>{selectedOrder.ShippingAddress}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-300">
                  Order Items
                </h3>
                {isOrderItemsLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-700 pb-2"
                      >
                        <Skeleton
                          width="200px"
                          height="20px"
                          variant="text"
                          className="mb-1"
                        />
                        <Skeleton
                          width="100px"
                          height="20px"
                          variant="text"
                          className="mb-1"
                        />
                        <Skeleton
                          width="120px"
                          height="20px"
                          variant="text"
                          className="mb-1"
                        />
                        <Skeleton width="150px" height="20px" variant="text" />
                      </div>
                    ))}
                  </div>
                ) : orderItemsError ? (
                  <p className="text-red-500">Error: {orderItemsError}</p>
                ) : orderItemsData && orderItemsData.length > 0 ? (
                  <ul className="space-y-2">
                    {orderItemsData.map((item) => (
                      <li
                        key={item.ID}
                        className="border-b border-gray-700 pb-2"
                      >
                        <p>
                          <strong>Product:</strong> {item.ProductName}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {item.Quantity}
                        </p>
                        <p>
                          <strong>Price at Time:</strong> ${item.PriceAtTime}
                        </p>
                        <p>
                          <strong>Created At:</strong>{" "}
                          {item.CreatedAt?.Time
                            ? new Date(item.CreatedAt.Time).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No items found for this order.</p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </>
  );
}
