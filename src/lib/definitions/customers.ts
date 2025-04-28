import { NullableBoolean, NullableDate, NullableString } from "./nullable";

export interface customer {
  ID?: string;
  Email?: NullableString;
  FirstName?: NullableString;
  LastName?: NullableString;
  Password?: NullableString;
  Address?: NullableString;
  Phone?: NullableString;
  CreatedAt?: NullableDate;
  IsSubscribed?: NullableBoolean;
}
