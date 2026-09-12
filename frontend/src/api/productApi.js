import { CROP_IMAGES } from "../utils/mockData.js";
import client from "./axios.js";

const normalizeProduct = (item = {}) => ({
  ...item,
  id: item.id || item._id,
  _id: item._id || item.id,
  cropName: item.cropName || item.name,
  image: item.image || item.images?.[0] || CROP_IMAGES[item.name] || CROP_IMAGES.Tomato,
  quantity: item.quantity ?? item.availableQuantity ?? 0,
  unit: item.unit || "kg",
  price: Number(item.price ?? 0),
  location: item.location || "Rajasthan",
  farmer: item.farmer?.farmName || item.farmer?.name || item.farmer || "KRISHIQ Farmer",
  fpo: item.fpo?.organizationName || item.fpo?.name || item.fpo || "KRISHIQ Pool",
  quality: item.quality || (item.organic ? "Organic" : "Fresh"),
  delivery: item.delivery || "36 hrs",
  match: item.match ?? 82,
  status: item.status || "Listed",
});

export const productApi = {
  async list() {
    const { data } = await client.get("/products");
    const items = Array.isArray(data?.data) ? data.data : [];
    return items.map(normalizeProduct);
  },
  async get(id) {
    const { data } = await client.get(`/products/${id}`);
    const item = data?.data || null;
    return item ? normalizeProduct(item) : null;
  },
  async create(payload) {
    const { data } = await client.post("/products", payload);
    return normalizeProduct(data?.data || data);
  },
  async update(id, payload) {
    const { data } = await client.put(`/products/${id}`, payload);
    return normalizeProduct(data?.data || data);
  },
  async remove(id) {
    await client.delete(`/products/${id}`);
    return { ok: true };
  },
};

export default productApi;
