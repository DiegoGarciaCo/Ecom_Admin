import { Product } from "../definitions/products";

export async function getProducts() {
  const res = await fetch("http://localhost:8080/api/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createProduct(product: Product) {
  const formData = new FormData();
  formData.append("name", product.Name || "");
  formData.append("basePrice", product.BasePrice || "");
  formData.append("currentPrice", product.CurrentPrice || "");
  formData.append("description", product.Description?.String || "");
  formData.append("stock", product.Stock?.Int32.toString() || "0");
  formData.append("weight", product.Weight?.String || "");
  if (product.Images) {
    product.Images.forEach((file) => formData.append("image", file));
  }

  const res = await fetch("http://localhost:8080/api/products", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(product: Product) {
  const payload = {
    name: product.Name || "",
    basePrice: product.BasePrice || "",
    currentPrice: product.CurrentPrice || "",
    description: product.Description?.String || "",
    stock: product.Stock?.Int32 || 0,
    weight: product.Weight?.String || "",
    imageUrl: product.ImageUrl?.String || "",
  };

  const res = await fetch(`http://localhost:8080/api/products/${product.ID}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`http://localhost:8080/api/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete product");
  return res.status === 204 ? null : res.json();
}
