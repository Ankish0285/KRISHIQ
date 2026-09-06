import { VEHICLES, ROUTE_PLAN, delay } from "../utils/mockData.js";

export const logisticsApi = {
  async vehicles() {
    await delay();
    return VEHICLES;
  },
  async routePlan() {
    await delay();
    return ROUTE_PLAN;
  },
  async track(orderId) {
    await delay();
    return { orderId, ...ROUTE_PLAN, live: true };
  },
};

export default logisticsApi;
