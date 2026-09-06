import { DEMO_USERS, delay } from "../utils/mockData.js";
import { readJSON, writeJSON, STORAGE_KEYS } from "../utils/storage.js";

function users() {
  const stored = readJSON(STORAGE_KEYS.users, null);
  if (stored) return stored;
  writeJSON(STORAGE_KEYS.users, DEMO_USERS);
  return DEMO_USERS;
}

export const authApi = {
  async login({ identifier, password }) {
    await delay();
    const list = users();
    const user = list.find(
      (u) =>
        (u.email === identifier || u.mobile === identifier) &&
        u.password === password
    );
    if (!user) throw new Error("Invalid credentials. Try a demo account.");
    const { password: _pw, ...safe } = user;
    return { user: safe, token: `demo-${safe.id}` };
  },
  async register(payload) {
    await delay();
    const list = users();
    if (list.some((u) => u.email === payload.email)) {
      throw new Error("An account with this email already exists.");
    }
    const user = {
      id: `u-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      mobile: payload.mobile,
      password: payload.password,
      role: payload.role,
      location: payload.location,
      organization: payload.organization || payload.name,
    };
    writeJSON(STORAGE_KEYS.users, [...list, user]);
    const { password: _pw, ...safe } = user;
    return { user: safe, token: `demo-${safe.id}` };
  },
  async me() {
    await delay(80);
    return readJSON(STORAGE_KEYS.user, null);
  },
};

export default authApi;
