import { PRODUCTS, delay, CROP_IMAGES } from "../utils/mockData.js";
import { readJSON, writeJSON, STORAGE_KEYS } from "../utils/storage.js";

function products() {
  const stored = readJSON(STORAGE_KEYS.products, null);
  if (stored) return stored;
  writeJSON(STORAGE_KEYS.products, PRODUCTS);
  return PRODUCTS;
}

export const productApi = {
  async list() {
    await delay();
    return products();
  },
  async get(id) {
    await delay();
    return products().find((p) => p.id === id) || null;
  },
  async create(payload) {
    await delay();
    const item = {
      id: `p-${Date.now()}`,
      image: CROP_IMAGES[payload.cropName] || CROP_IMAGES.Tomato,
      demandScore: 70,
      match: 75,
      delivery: "48 hrs",
      status: "Listed",
      farmer: payload.farmer || "Platform Lot",
      fpo: payload.fpo || "KRISHIQ Pool",
      ...payload,
    };
    const next = [item, ...products()];
    writeJSON(STORAGE_KEYS.products, next);
    return item;
  },
  async update(id, payload) {
    await delay();
    const next = products().map((p) => (p.id === id ? { ...p, ...payload } : p));
    writeJSON(STORAGE_KEYS.products, next);
    return next.find((p) => p.id === id);
  },
  async remove(id) {
    await delay();
    writeJSON(
      STORAGE_KEYS.products,
      products().filter((p) => p.id !== id)
    );
    return { ok: true };
  },
};

export default productApi;
