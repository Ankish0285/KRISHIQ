import client from "./axios.js";

const normalizeFarmer = (item = {}) => ({
  id: item.id || item._id,
  name: item.user?.name || item.name || "Farmer",
  location: item.location || item.user?.location || item.address || "Jaipur",
  crop: item.crops?.[0] || item.crop || "Produce",
  quantity: Number(item.quantity ?? item.availableQuantity ?? 0),
  status: item.status || "Active",
  contact: item.user?.phone || item.contact || "",
});

const normalizeInventory = (items = []) => {
  const totals = new Map();

  items.forEach((item) => {
    const name = item.name || item.cropName || "Produce";
    const current = totals.get(name) || { crop: name, quantity: 0, price: Number(item.price || 0), demand: item.status || "High Demand" };
    current.quantity += Number(item.quantity ?? item.availableQuantity ?? 0);
    current.price = Number(current.price || item.price || 0);
    if (!current.demand || current.demand === "High Demand") {
      current.demand = item.status || "High Demand";
    }
    totals.set(name, current);
  });

  return Array.from(totals.values()).map((item) => ({
    ...item,
    quantity: Number(item.quantity || 0),
    price: Number(item.price || 0),
    demand: item.demand || "High Demand",
  }));
};

const normalizeBulkOrders = (items = []) =>
  items.map((order) => {
    const first = order.items?.[0]?.product || {};
    const qty = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

    return {
      id: order.id || order._id,
      buyer: order.buyer?.name || "Buyer",
      crop: first.name || "Produce",
      qty,
      maxPrice: Math.round((order.totalAmount || 0) / Math.max(qty, 1)),
      delivery: order.delivery ? "Assigned" : "Pending",
      match: Math.min(99, Math.round((first.rating || 0) * 20 || 80)),
      status: order.orderStatus === "cancelled" ? "Cancelled" : "Open",
    };
  });

export const fpoApi = {
  async dashboard() {
    const [profileRes, membersRes, inventoryRes, ordersRes] = await Promise.all([
      client.get("/fpo/profile"),
      client.get("/fpo/members"),
      client.get("/fpo/inventory"),
      client.get("/fpo/orders"),
    ]);

    const members = (membersRes.data?.data || []).map(normalizeFarmer);
    const inventory = normalizeInventory(inventoryRes.data?.data || []);
    const orders = ordersRes.data?.data || [];

    return {
      profile: profileRes.data?.data || {},
      stats: {
        farmers: members.length,
        inventory: inventory.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
        orders: orders.length,
        revenue: orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
      },
      inventory,
    };
  },

  async farmers() {
    const { data } = await client.get("/fpo/members");
    return (data?.data || []).map(normalizeFarmer);
  },

  async addFarmer(payload) {
    return { id: `f-${Date.now()}`, status: "Onboarded", ...payload };
  },

  async inventory() {
    const { data } = await client.get("/fpo/inventory");
    return normalizeInventory(data?.data || []);
  },

  async bulkOrders() {
    const { data } = await client.get("/fpo/orders");
    return normalizeBulkOrders(data?.data || []);
  },
};

export default fpoApi;
