import { CROP_IMAGES } from "../utils/mockData.js";
import client from "./axios.js";

const normalizeProduct = (item = {}) => ({
  ...item,
  id: item.id || item._id,
  _id: item._id || item.id,
  cropName: item.cropName || item.name,
  quantity: Number(item.quantity ?? item.availableQuantity ?? 0),
  unit: item.unit || "kg",
  price: Number(item.price ?? 0),
  location: item.location || "Jaipur",
  quality: item.quality || (item.organic ? "Organic" : "A Grade"),
  image: item.image || item.images?.[0] || CROP_IMAGES[item.name] || CROP_IMAGES.Tomato,
  status: item.status || "Listed",
  harvestDate: item.harvestDate ? new Date(item.harvestDate).toISOString().slice(0, 10) : "",
  demandScore: Number(item.demandScore ?? item.rating ?? 80),
  match: Number(item.match ?? 80),
  description: item.description || "",
});

export const farmerApi = {
  async dashboard() {
    const [profileRes, inventoryRes, ordersRes, earningsRes, demandRes] = await Promise.all([
      client.get("/farmers/profile"),
      client.get("/farmers/inventory"),
      client.get("/farmers/orders"),
      client.get("/farmers/earnings"),
      client.get("/farmers/demand"),
    ]);

    const profile = profileRes.data?.data || {};
    const produce = (inventoryRes.data?.data || []).map(normalizeProduct);
    const orders = ordersRes.data?.data || [];
    const earnings = earningsRes.data?.data || {};
    const demand = demandRes.data?.data || [];
    const averageDemand = demand.length
      ? Math.round(demand.reduce((sum, item) => sum + Number(item.demandScore || 0), 0) / demand.length)
      : 82;

    return {
      profile,
      stats: {
        totalProduce: produce.reduce((sum, p) => sum + Number(p.quantity || 0), 0),
        activeOrders: orders.filter((order) => !["delivered", "cancelled", "returned"].includes(order.orderStatus)).length,
        earnings: Number(earnings.earnings || 0),
        aiDemandScore: averageDemand,
      },
      produce,
      insight: {
        crop: demand[0]?.category || "Tomato",
        current: averageDemand,
        forecast: Math.min(100, averageDemand + 8),
        change: demand.length > 1 ? Math.max(0, demand[0].demandScore - demand[1].demandScore) : 8,
        action: "Review market demand and adjust pricing or quantities before the next market window.",
        text: demand.length
          ? `Current demand signal is ${averageDemand} for your main crops.`
          : "Demand insights are being refreshed for your farm profile.",
      },
    };
  },

  async listProduce() {
    const { data } = await client.get("/farmers/inventory");
    return (data?.data || []).map(normalizeProduct);
  },

  async addProduce(payload) {
    const { data } = await client.post("/products", {
      name: payload.cropName,
      category: payload.category,
      description: payload.description || `${payload.cropName} listing from KRISHIQ farmer profile.`,
      price: Number(payload.minPrice || payload.price || 0),
      unit: payload.unit || "kg",
      quantity: Number(payload.quantity || 0),
      minimumOrderQuantity: 1,
      location: payload.location,
      organic: payload.quality === "Organic",
      harvestDate: payload.harvestDate,
      images: payload.image ? [payload.image] : [],
    });
    return normalizeProduct(data?.data || data);
  },

  async updateProduce(id, payload) {
    const { data } = await client.put(`/products/${id}`, {
      name: payload.cropName,
      quantity: Number(payload.quantity ?? 0),
      price: Number(payload.price ?? payload.minPrice ?? 0),
      description: payload.description,
      location: payload.location,
    });
    return normalizeProduct(data?.data || data);
  },

  async deleteProduce(id) {
    await client.delete(`/products/${id}`);
    return { ok: true };
  },

  async earnings() {
    const { data } = await client.get("/farmers/earnings");
    const payload = data?.data || {};

    return {
      total: Number(payload.earnings || 0),
      month: Number(payload.month || payload.earnings || 0),
      pending: Number(payload.pending || 0),
      completed: Number(payload.orders || 0),
    };
  },
};

export default farmerApi;
