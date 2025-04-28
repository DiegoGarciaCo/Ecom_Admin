import { Order } from "../definitions/orders";

export const getOrders = async () => {
  const res = await fetch("http://localhost:8080/api/orders", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  if (data) {
    return data;
  } else {
    return [];
  }
};

export const getOrderItems = async (orderId: string) => {
  const res = await fetch(`http://localhost:8080/api/order-items/${orderId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch order items");
  return res.json();
};

export async function updateOrder(order: Order) {
  const res = await fetch(`http://localhost:8080/api/orders/${order.ID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: order.Status }),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}

export async function deleteOrder(id: string) {
  const res = await fetch(`http://localhost:8080/api/orders/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete order");
  return res.json();
}
