export const getCustomers = async () => {
  const res = await fetch("http://localhost:8080/api/users", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch customers");
  const data = await res.json();
  if (data) {
    return data;
  } else {
    return [];
  }
};
