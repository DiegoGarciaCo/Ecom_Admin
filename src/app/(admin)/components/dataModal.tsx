"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { z } from "zod";
import { Product } from "@/lib/definitions/products";
import { Category } from "@/lib/definitions/categories";
import { Order } from "@/lib/definitions/dashboard";
import { Promotion } from "@/lib/definitions/promotions";
import { customer } from "@/lib/definitions/customers";

export interface Field<T> {
  key: keyof T | string;
  label: string;
  type:
    | "text"
    | "number"
    | "select"
    | "textarea"
    | "date"
    | "file"
    | "checkbox";
  options?: { value: string; label: string }[];
  required?: boolean;
  render?: (value: any) => string;
}

const productCreateSchema = z.object({
  Name: z.string().min(1, "Name is required"),
  BasePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  CurrentPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  Description: z.string().min(1, "Description is required"),
  Weight: z.string().min(1, "Weight is required"),
  Stock: z.number().min(0, "Stock cannot be negative"),
  Images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .refine(
      (files) => files.every((file) => file.type.startsWith("image/")),
      "All files must be images"
    ),
});

const productUpdateSchema = z.object({
  Name: z.string().min(1, "Name is required"),
  BasePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  CurrentPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  Description: z.string().min(1, "Description is required"),
  Weight: z.string().min(1, "Weight is required"),
  Stock: z.number().min(0, "Stock cannot be negative"),
  ImageUrl: z
    .string()
    .url("Invalid URL format")
    .min(1, "Image URL is required"),
});

const categoryCreateSchema = z.object({
  Name: z.string().min(1, "Name is required"),
  Slug: z.string().min(1, "Slug is required"),
  IsGenderSpecific: z.boolean({
    required_error: "Gender specificity is required",
  }),
  Description: z.string().min(1, "Description is required"),
  parentID: z.string().optional(),
  ImageFile: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), "File must be an image")
    .refine((file) => file.size > 0, "Image is required"),
});

const categoryUpdateSchema = z.object({
  Name: z.string().min(1, "Name is required"),
  Slug: z.string().min(1, "Slug is required"),
  IsGenderSpecific: z.boolean({
    required_error: "Gender specificity is required",
  }),
  Description: z.string().min(1, "Description is required"),
  parentID: z.string().optional(),
  ImageFile: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "File must be an image"
    ),
});

interface DataModalProps<
  T extends Product | Category | Order | Promotion | customer
> {
  type: "product" | "category" | "order" | "promotion" | "customer";
  item: T | null;
  fields: Field<T>[];
  onSave: (item: T) => void;
  onClose: () => void;
}

export default function DataModal<
  T extends Product | Category | Order | Promotion | customer
>({ type, item, fields, onSave, onClose }: DataModalProps<T>) {
  const [formData, setFormData] = useState<T>(() => {
    if (item) {
      const normalizedItem: any = { ...item };
      for (const key in item) {
        const value = (item as any)[key];
        if (value && typeof value === "object") {
          if ("String" in value && "Valid" in value) {
            normalizedItem[key] = value.Valid ? value.String : "";
          } else if ("Time" in value && "Valid" in value) {
            normalizedItem[key] = value.Valid ? value.Time : "";
          } else if ("Boolean" in value && "Valid" in value) {
            normalizedItem[key] = value.Valid ? value.Boolean : false;
          } else if ("Int32" in value && "Valid" in value) {
            normalizedItem[key] = value.Valid ? value.Int32 : 0;
          }
        }
      }
      normalizedItem.Images = undefined;
      normalizedItem.ImageFile = undefined;
      return normalizedItem;
    }

    const defaults: Record<string, T> = {
      product: {
        Name: "",
        Description: "",
        BasePrice: "0.00",
        CurrentPrice: "0.00",
        Weight: "",
        Stock: 0,
        ImageUrl: "",
        Images: [],
      } as unknown as Product as T,
      category: {
        Name: "",
        Slug: "",
        IsGenderSpecific: false,
        Description: "",
        parentID: "",
      } as unknown as Category as T,
      order: {
        ID: "",
        UserID: "",
        CustomerName: "",
        TotalAmount: "0.00",
        Status: "pending",
        ShippingAddress: "",
        Customer: "",
        Date: new Date().toISOString(),
        Total: "0",
      } as unknown as Order as T,
      promotion: {
        ID: "",
        Name: "",
        Description: "",
        DiscountPercentage: "",
        DiscountAmount: "",
        BundlePrice: "",
        ProductID: "",
        CategoryID: "",
        StartDate: new Date().toISOString().split("T")[0],
        EndDate: "",
        IsActive: true,
      } as Promotion as T,
      customer: {
        ID: "",
        Email: "",
        FirstName: "",
        LastName: "",
        Phone: "",
      } as unknown as customer as T,
    };
    return defaults[type];
  });

  const [filePreviews, setFilePreviews] = useState<string[]>(
    item && type === "category" && (item as Category).ImageUrl?.Valid
      ? [(item as Category).ImageUrl!.String]
      : item && type === "product" && (item as Product).ImageUrl?.Valid
      ? [(item as Product).ImageUrl!.String]
      : []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stockInput, setStockInput] = useState<string>(
    item && (item as Product).Stock !== undefined
      ? ((item as Product).Stock?.Valid
          ? (item as Product).Stock!.Int32
          : 0
        ).toString()
      : "0"
  );

  useEffect(() => {
    if (item) {
      const normalizedItem: any = { ...item };
      for (const key in item) {
        const value = (item as any)[key];
        if (value && typeof value === "object") {
          if ("String" in value && "Valid" in value) {
            normalizedItem[key] = value.Valid ? value.String : "";
          } else if ("Time" in value && "Valid" in value) {
            normalizedItem[key] = value.Valid ? value.Time : "";
          } else if ("Boolean" in value && "Valid" in value) {
            normalizedItem[key] = value.Valid ? value.Boolean : false;
          } else if ("Int32" in value && "Valid" in value) {
            normalizedItem[key] = value.Valid ? value.Int32 : 0;
          }
        }
      }
      normalizedItem.Images = undefined;
      normalizedItem.ImageFile = undefined;
      setFormData(normalizedItem);
      if (type === "category" && (item as Category).ImageUrl?.Valid) {
        setFilePreviews([(item as Category).ImageUrl!.String]);
      } else if (type === "product" && (item as Product).ImageUrl?.Valid) {
        setFilePreviews([(item as Product).ImageUrl!.String]);
      } else {
        setFilePreviews([]);
      }
      if ((item as Product).Stock !== undefined) {
        setStockInput(
          ((item as Product).Stock?.Valid
            ? (item as Product).Stock!.Int32
            : 0
          ).toString()
        );
      }
    }
  }, [item, type]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type: inputType } = e.target;
    if (name === "Stock") {
      setStockInput(value);
    } else if (inputType === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          inputType === "number"
            ? parseFloat(value) || 0
            : name === "BasePrice" || name === "CurrentPrice"
            ? value
            : value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStockBlur = () => {
    const parsedStock = parseFloat(stockInput) || 0;
    setFormData((prev) => ({
      ...prev,
      Stock: parsedStock,
    }));
    setStockInput(parsedStock.toString());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (type === "category") {
        setFormData((prev) => ({
          ...prev,
          ImageFile: files[0],
          ImageUrl: undefined,
        }));
        setFilePreviews([URL.createObjectURL(files[0])]);
      } else if (type === "product" && !item) {
        setFormData((prev) => ({
          ...prev,
          Images: files,
          ImageFile: undefined,
          ImageUrl: undefined,
        }));
        setFilePreviews(files.map((file) => URL.createObjectURL(file)));
      }
      setErrors((prev) => ({ ...prev, Images: "", ImageFile: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "product") {
      const productData = formData as Product;
      const dataToValidate: any = {
        Name: productData.Name,
        BasePrice: productData.BasePrice,
        CurrentPrice: productData.CurrentPrice,
        Description: productData.Description,
        Weight: productData.Weight,
        Stock: parseFloat(stockInput) || 0,
        ImageUrl: productData.ImageUrl,
        Images: productData.Images,
      };
      const schema = item ? productUpdateSchema : productCreateSchema;
      const result = schema.safeParse(dataToValidate);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        return;
      }
      const validatedData: Product = {
        ...productData,
        Description: { String: productData.Description as string, Valid: true },
        Weight: { String: productData.Weight as string, Valid: true },
        Stock: { Int32: parseFloat(stockInput) || 0, Valid: true },
        ImageUrl: item
          ? { String: productData.ImageUrl as string, Valid: true }
          : undefined,
        Images: item ? undefined : productData.Images,
      };
      onSave(validatedData as T);
    } else if (type === "category") {
      const categoryData = formData as Category;
      const dataToValidate: any = {
        Name: categoryData.Name,
        Slug: categoryData.Slug,
        IsGenderSpecific: categoryData.IsGenderSpecific,
        Description: categoryData.Description,
        parentID: categoryData.parentID,
        ImageFile: categoryData.ImageFile,
      };
      const schema = item ? categoryUpdateSchema : categoryCreateSchema;
      const result = schema.safeParse(dataToValidate);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        return;
      }
      const validatedData: Category = {
        ...categoryData,
        Description: {
          String: categoryData.Description as string,
          Valid: true,
        },
        IsGenderSpecific: {
          Boolean: categoryData.IsGenderSpecific as boolean,
          Valid: true,
        },
        parentID: {
          String: (categoryData.parentID as string) || "",
          Valid: !!categoryData.parentID,
        },
        ImageFile: categoryData.ImageFile,
        ImageUrl: item
          ? { String: (item as Category).ImageUrl?.String || "", Valid: true }
          : undefined,
      };
      onSave(validatedData as T);
    } else {
      onSave(formData);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-gray-800 rounded-lg p-6 text-gray-100 max-h-[80vh] flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-4">
            {item
              ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`
              : `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </h2>
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key as string}>
                  <label className="block text-sm font-medium text-gray-400">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <>
                      <textarea
                        name={field.key as string}
                        value={(formData[field.key as keyof T] as string) || ""}
                        onChange={handleChange}
                        className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-gray-300 focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required={field.required}
                      />
                      {errors[field.key as string] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field.key as string]}
                        </p>
                      )}
                    </>
                  ) : field.type === "file" && (!item || type !== "product") ? (
                    <div>
                      <input
                        type="file"
                        name={field.key as string}
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple={type === "product" && !item}
                        className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-gray-300 focus:ring-2 focus:ring-blue-500"
                        required={field.required && !item}
                      />
                      {filePreviews.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {filePreviews.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="max-w-[100px] rounded"
                            />
                          ))}
                        </div>
                      )}
                      {errors[field.key as string] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field.key as string]}
                        </p>
                      )}
                    </div>
                  ) : field.type === "checkbox" ? (
                    <>
                      <input
                        type="checkbox"
                        name={field.key as string}
                        checked={!!formData[field.key as keyof T]}
                        onChange={handleChange}
                        className="rounded bg-gray-700 border border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                      {errors[field.key as string] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field.key as string]}
                        </p>
                      )}
                    </>
                  ) : field.type === "select" ? (
                    <>
                      <select
                        name={field.key as string}
                        value={(formData[field.key as keyof T] as string) || ""}
                        onChange={handleChange}
                        className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-gray-300 focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      >
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors[field.key as string] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field.key as string]}
                        </p>
                      )}
                    </>
                  ) : field.key === "Stock" ? (
                    <>
                      <input
                        type="text"
                        name={field.key as string}
                        value={stockInput}
                        onChange={handleChange}
                        onBlur={handleStockBlur}
                        className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-gray-300 focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      />
                      {errors[field.key as string] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field.key as string]}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <input
                        type={field.type}
                        name={field.key as string}
                        value={
                          field.type === "number"
                            ? (formData[field.key as keyof T] as number) || 0
                            : (formData[field.key as keyof T] as string) || ""
                        }
                        onChange={handleChange}
                        min={field.type === "number" ? "0" : undefined}
                        className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-gray-300 focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      />
                      {errors[field.key as string] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field.key as string]}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                {item ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
