import client from "./axios.js";

export const publicApi = {
  siteSettings: async () => (await client.get("/public/site-settings")).data?.data || {},
  products: async () => (await client.get("/products", { params: { status: "active" } })).data?.data || [],
  reviews: async () => (await client.get("/reviews/public")).data?.data || [],
};
