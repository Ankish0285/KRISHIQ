import { PRODUCTS, SUPPLIER_RECS, delay } from "../utils/mockData.js";
import { readJSON, writeJSON, STORAGE_KEYS } from "../utils/storage.js";

function products() {
  const stored = readJSON(STORAGE_KEYS.products, null);
  if (stored) return stored;
  writeJSON(STORAGE_KEYS.products, PRODUCTS);
  return PRODUCTS;
}

export const buyerApi = {
  async dashboard() {
    await delay();
    return {
      stats: { activeOrders: 5, purchases: 214000, savedSuppliers: 12, matchScore: 91 },
      recommended: products().slice(0, 4),
      supplier: SUPPLIER_RECS[0],
    };
  },
  async marketplace(filters = {}) {
    await delay();
    let list = products();
    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.cropName.toLowerCase().includes(q) ||
          p.farmer.toLowerCase().includes(q) ||
          p.fpo.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }
    if (filters.crop && filters.crop !== "All") list = list.filter((p) => p.cropName === filters.crop);
    if (filters.category && filters.category !== "All") list = list.filter((p) => p.category === filters.category);
    if (filters.location && filters.location !== "All") list = list.filter((p) => p.location === filters.location);
    if (filters.quality && filters.quality !== "All") list = list.filter((p) => p.quality === filters.quality);
    if (filters.maxPrice) list = list.filter((p) => p.price <= Number(filters.maxPrice));
    if (filters.minQty) list = list.filter((p) => p.quantity >= Number(filters.minQty));
    return list;
  },
};

export default buyerApi;
