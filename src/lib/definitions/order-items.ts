import { NullableDate } from "./nullable";

export interface orderItems {
  ID: string;
  OrderID: string;
  ProductID: string;
  Quantity: number;
  PriceAtTime: string;
  CreatedAt: NullableDate;
  ProductName: string;
}
