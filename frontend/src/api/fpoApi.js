import { FPO_FARMERS, FPO_INVENTORY, BULK_ORDERS, delay } from "../utils/mockData.js";
import { readJSON, writeJSON, STORAGE_KEYS } from "../utils/storage.js";

function farmers() {
  const stored = readJSON(STORAGE_KEYS.fpoFarmers, null);
  if (stored) return stored;
  writeJSON(STORAGE_KEYS.fpoFarmers, FPO_FARMERS);
  return FPO_FARMERS;
}

export const fpoApi = {
  async dashboard() {
    await delay();
    const list = farmers();
    return {
      stats: {
        farmers: list.length,
        inventory: 18180,
        orders: 11,
        revenue: 642000,
      },
      inventory: FPO_INVENTORY,
    };
  },
  async farmers() {
    await delay();
    return farmers();
  },
  async addFarmer(payload) {
    await delay();
    const list = farmers();
    const item = { id: `f-${Date.now()}`, status: "Onboarded", ...payload };
    writeJSON(STORAGE_KEYS.fpoFarmers, [item, ...list]);
    return item;
  },
  async inventory() {
    await delay();
    return FPO_INVENTORY;
  },
  async bulkOrders() {
    await delay();
    return BULK_ORDERS;
  },
};

export default fpoApi;
