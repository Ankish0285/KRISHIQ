import { PRODUCTS, delay, CROP_IMAGES } from "../utils/mockData.js";
import { readJSON, writeJSON, STORAGE_KEYS } from "../utils/storage.js";

function seedProduce() {
  const stored = readJSON(STORAGE_KEYS.produce, null);
  if (stored) return stored;
  const farmerLots = PRODUCTS.filter((p) => p.farmer === "Ramesh Singh").map((p) => ({
    ...p,
    image: CROP_IMAGES[p.cropName],
  }));
  writeJSON(STORAGE_KEYS.produce, farmerLots);
  return farmerLots;
}

export const farmerApi = {
  async dashboard() {
    await delay();
    const produce = seedProduce();
    return {
      stats: {
        totalProduce: produce.reduce((s, p) => s + p.quantity, 0),
        activeOrders: 4,
        earnings: 186400,
        aiDemandScore: 86,
      },
      produce,
      insight: {
        crop: "Tomato",
        current: 78,
        forecast: 92,
        change: 18,
        action: "Increase listing by 200 kg and hold price near ₹28/kg.",
        text: "Tomato demand expected to rise 18% next week.",
      },
    };
  },
  async listProduce() {
    await delay();
    return seedProduce();
  },
  async addProduce(payload) {
    await delay();
    const list = seedProduce();
    const item = {
      id: `p-${Date.now()}`,
      cropName: payload.cropName,
      category: payload.category,
      quantity: Number(payload.quantity),
      unit: payload.unit,
      harvestDate: payload.harvestDate,
      price: Number(payload.minPrice),
      quality: payload.quality,
      location: payload.location,
      description: payload.description,
      farmer: "Ramesh Singh",
      fpo: "Jaipur Fresh FPO",
      demandScore: 80,
      match: 82,
      delivery: "36 hrs",
      status: "Listed",
      image: payload.image || CROP_IMAGES[payload.cropName] || CROP_IMAGES.Tomato,
    };
    const next = [item, ...list];
    writeJSON(STORAGE_KEYS.produce, next);
    return item;
  },
  async updateProduce(id, payload) {
    await delay();
    const list = seedProduce().map((p) => (p.id === id ? { ...p, ...payload } : p));
    writeJSON(STORAGE_KEYS.produce, list);
    return list.find((p) => p.id === id);
  },
  async deleteProduce(id) {
    await delay();
    const list = seedProduce().filter((p) => p.id !== id);
    writeJSON(STORAGE_KEYS.produce, list);
    return { ok: true };
  },
  async earnings() {
    await delay();
    return {
      total: 186400,
      month: 54000,
      pending: 22400,
      completed: 12,
    };
  },
};

export default farmerApi;
