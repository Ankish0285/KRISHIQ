import client from "./axios.js";

const unwrap = (response) => response.data?.data || response.data;

export const adminApi = {
  overview: async () => unwrap(await client.get("/admin/overview")),
  users: async (params) => unwrap(await client.get("/admin/users", { params })),
  updateUser: async (id, payload) => unwrap(await client.patch(`/admin/users/${id}`, payload)),
  deleteUser: async (id) => unwrap(await client.delete(`/admin/users/${id}`)),
  products: async (params) => unwrap(await client.get("/admin/products", { params })),
  updateProduct: async (id, payload) => unwrap(await client.patch(`/admin/products/${id}`, payload)),
  deleteProduct: async (id) => unwrap(await client.delete(`/admin/products/${id}`)),
  orders: async (params) => unwrap(await client.get("/admin/orders", { params })),
  updateOrderStatus: async (id, status) => unwrap(await client.patch(`/admin/orders/${id}/status`, { status })),
  auditLogs: async (params) => unwrap(await client.get("/admin/audit-logs", { params })),
  settings: async () => unwrap(await client.get("/admin/settings")),
  updateSettings: async (payload) => unwrap(await client.patch("/admin/settings", payload)),
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append("media", file);
    return unwrap(await client.post("/admin/media", formData));
  },
  createAdmin: async (payload) => unwrap(await client.post("/admin/admins", payload)),
};

export default adminApi;