import { DEMAND_SERIES, WEEKS, SUPPLIER_RECS, delay } from "../utils/mockData.js";

export const aiApi = {
  async demandForecast({ crop = "Tomato", location = "Jaipur" } = {}) {
    await delay();
    const series = DEMAND_SERIES[crop] || DEMAND_SERIES.Tomato;
    const current = series[series.length - 2];
    const predicted = series[series.length - 1];
    const change = Math.round(((predicted - current) / current) * 100);
    return {
      crop,
      location,
      weeks: WEEKS,
      series,
      current,
      predicted,
      change,
      confidence: 91,
      recommendation: `Based on predicted demand, consider increasing ${crop.toLowerCase()} production for the next 2 weeks.`,
    };
  },
  async pricePrediction(crop = "Tomato") {
    await delay();
    const map = { Tomato: 28, Onion: 22, Potato: 20, Wheat: 26, Rice: 42, Chilli: 95 };
    const now = map[crop] || 30;
    return { crop, current: now, predicted: now + 3, range: [now - 2, now + 5] };
  },
  async matchSuppliers(payload) {
    await delay();
    const crop = payload.crop || "Tomato";
    return {
      suppliers: SUPPLIER_RECS.map((s) => ({ ...s, crop })),
      plan: {
        totalQty: Number(payload.quantity) || 1200,
        blendedPrice: 26.1,
        farms: 3,
        note: "Split across three verified lots to hit quantity without exceeding ₹27/kg.",
      },
    };
  },
};

export default aiApi;
