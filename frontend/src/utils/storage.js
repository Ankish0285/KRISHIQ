export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const STORAGE_KEYS = {
  user: "krishiq_user",
  users: "krishiq_users",
  theme: "krishiq_theme",
  produce: "krishiq_produce",
  orders: "krishiq_orders",
  fpoFarmers: "krishiq_fpo_farmers",
  cart: "krishiq_cart",
  products: "krishiq_products",
};
