import { NullableBoolean, NullableDate, NullableString } from "./nullable";

export interface Category {
  ID?: string;
  Name?: string;
  Slug?: string;
  parentID?: NullableString;
  IsGenderSpecific?: NullableBoolean;
  ParentName?: NullableString;
  ParentSlug?: NullableString;
  Description?: NullableString;
  ImageUrl?: NullableString;
  CreatedAt?: NullableDate;
  UpdatedAt?: NullableDate;
  ImageFile?: File;
}
