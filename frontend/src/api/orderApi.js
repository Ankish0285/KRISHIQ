import { ORDERS, delay } from "../utils/mockData.js";
import { readJSON, writeJSON, STORAGE_KEYS } from "../utils/storage.js";

function orders() {
  const stored = readJSON(STORAGE_KEYS.orders, null);
  if (stored) return stored;
  writeJSON(STORAGE_KEYS.orders, ORDERS);
  return ORDERS;
}

export const orderApi = {
  async list(role) {
    await delay();
    const list = orders();
    if (role === "farmer") return list.filter((o) => o.farmer === "Ramesh Singh" || true);
    if (role === "buyer") return list.filter((o) => o.status !== "hidden");
    return list;
  },
  async get(id) {
    await delay();
    return orders().find((o) => o.id === id) || orders()[0];
  },
  async create(payload) {
    await delay();
    const item = {
      id: `ORD-${Math.floor(2400 + Math.random() * 500)}`,
      status: "Order Placed",
      placedOn: new Date().toISOString().slice(0, 10),
      driver: "Pending assignment",
      vehicle: "TBD",
      currentLocation: payload.deliveryLocation || "Assigned hub",
      distance: "Calculating",
      eta: payload.preferredDate || "TBD",
      ...payload,
    };
    writeJSON(STORAGE_KEYS.orders, [item, ...orders()]);
    return item;
  },
  async updateStatus(id, status) {
    await delay();
    const next = orders().map((o) => (o.id === id ? { ...o, status } : o));
    writeJSON(STORAGE_KEYS.orders, next);
    return next.find((o) => o.id === id);
  },
};

export default orderApi;
