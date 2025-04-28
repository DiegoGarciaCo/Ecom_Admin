import { NullableDate, NullableString } from "./nullable";

export interface Product {
  ID?: string;
  CategoryID?: string;
  Name?: string;
  Description?: NullableString;
  BasePrice?: string;
  CurrentPrice?: string;
  ImageUrl?: NullableString;
  CreatedAt?: NullableDate;
  UpdatedAt?: NullableDate;
  CategoryName?: string;
  Stock?: { Int32: number; Valid: boolean };
  ReservedStock?: { Int32: number; Valid: boolean };
  TotalCount?: number;
  Weight?: NullableString;
  Images?: File[];
}
