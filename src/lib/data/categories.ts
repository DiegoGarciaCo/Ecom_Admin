import { Category } from "../definitions/categories";

export async function getCategories() {
  const res = await fetch("http://localhost:8080/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function createCategory(category: Category) {
  const formData = new FormData();
  formData.append("name", category.Name || "");
  formData.append("slug", category.Slug || "");
  formData.append(
    "isGenderSpecific",
    String(category.IsGenderSpecific?.Boolean || false)
  );
  formData.append("description", category.Description?.String || "");
  if (category.ImageFile) {
    formData.append("image", category.ImageFile);
  }

  const res = await fetch(`http://localhost:8080/api/categories`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to update category");
  if (res.status === 204) {
    return null;
  }
  return res.json();
}

export async function updateCategory(category: Category) {
  const formData = new FormData();
  formData.append("name", category.Name || "");
  formData.append("slug", category.Slug || "");
  formData.append(
    "isGenderSpecific",
    String(category.IsGenderSpecific?.Boolean || false)
  );
  formData.append("description", category.Description?.String || "");
  if (category.ImageFile) {
    formData.append("image", category.ImageFile);
  }

  const res = await fetch(
    `http://localhost:8080/api/categories/${category.ID}`,
    {
      method: "PUT",
      body: formData,
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to update category");
  if (res.status === 204) {
    return null;
  }
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(`http://localhost:8080/api/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete category");
  if (res.status === 204) {
    return null;
  }
  return res.json();
}
