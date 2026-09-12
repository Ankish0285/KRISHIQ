import { productApi } from "./productApi.js";

export const buyerApi = {
  async dashboard() {
    const list = await productApi.list();
    const matchScore = list.length
      ? Math.round(list.reduce((sum, item) => sum + (item.match || 0), 0) / list.length)
      : 0;

    return {
      stats: {
        activeOrders: 5,
        purchases: 214000,
        savedSuppliers: 12,
        matchScore,
      },
      recommended: list.slice(0, 4),
      supplier: {
        name: "Jaipur Fresh FPO",
        location: "Jaipur",
        match: matchScore || 90,
      },
    };
  },
  async marketplace(filters = {}) {
    let list = await productApi.list();

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
