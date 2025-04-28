// Alerts
export async function getAlerts() {
  const res = await fetch("http://localhost:8080/api/dashboard/alerts", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}

// Recent Orders
export async function getRecentOrders() {
  const res = await fetch("http://localhost:8080/api/dashboard/recent-orders", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

// Stats
export async function getStats() {
  const res = await fetch("http://localhost:8080/api/dashboard/stats", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

// Top Products
export async function getTopProducts() {
  const res = await fetch("http://localhost:8080/api/dashboard/top-products", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch top products");
  return res.json();
}

// Sales Chart
export async function getSalesChartData() {
  const res = await fetch("http://localhost:8080/api/dashboard/sales-chart", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch sales chart data");
  return res.json();
}
