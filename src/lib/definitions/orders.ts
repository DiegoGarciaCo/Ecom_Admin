import { NullableDate } from "./nullable";

export interface Order {
  ID: string;
  UserID: string;
  CustomerName: string;
  TotalAmount: string;
  Status: string;
  ShippingAddress: string;
  CreatedAt: NullableDate;
  UpdatedAt: NullableDate;
}
