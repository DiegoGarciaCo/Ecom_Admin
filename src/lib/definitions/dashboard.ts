// Alerts
export interface Notification {
  Message: string; // e.g., "Leather Belt back in stock"
  Type: "success" | "error" | "warning";
}

// Recent Orders
export interface Order {
  ID: string;
  Customer: string;
  Date: {
    Time: string;
    Valid: boolean;
  };
  Total: string;
  Status: "pending" | "shipped" | "delivered" | "cancelled";
}

// Stats
export interface statData {
  TotalSales: number;
  OrdersThisMonth: number;
  NewSubscribers: number;
  NewCustomers: number;
  SalesChange: number;
  OrdersChange: number;
  SubscribersChange: number;
  CustomersChange: number;
}

// Top Products
export interface ProductSales {
  Name: string;
  Sales: number;
  Revenue: string;
}

// Sales Chart
export interface monthlySales {
  month: string; // e.g., "Feb 2025"
  sales: number; // e.g., 219.98
}

export interface monthlyOrders {
  month: string; // e.g., "Feb 2025"
  orders: number; // e.g., 1
}

export interface revenuePerProduct {
  productName: string; // e.g., "Cowboy Boots"
  revenue: number; // e.g., 359.98
}

export interface DashboardStats {
  salesLast6Months: monthlySales[];
  ordersLast6Months: monthlyOrders[];
  revenuePerProduct: revenuePerProduct[];
}
