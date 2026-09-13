import { DEMO_USERS, delay } from "../utils/mockData.js";
import { readJSON, writeJSON, STORAGE_KEYS } from "../utils/storage.js";
import client from "./axios.js";

function users() {
  const stored = readJSON(STORAGE_KEYS.users, null);
  if (stored) return stored;
  writeJSON(STORAGE_KEYS.users, DEMO_USERS);
  return DEMO_USERS;
}

const normalizeUser = (user = {}) => ({
  ...user,
  id: user.id || user._id,
  _id: user._id || user.id,
  mobile: user.mobile || user.phone || "",
});

export const authApi = {
  async login({ identifier, password }) {
    try {
      const { data } = await client.post("/auth/login", { identifier, password });
      const payload = data?.data || data;
      if (payload?.requiresOtp) {
        return payload;
      }
      return {
        user: normalizeUser(payload.user),
        token: payload.token,
      };
    } catch (error) {
      if (error.response) throw error;
      await delay();
      const list = users();
      const user = list.find(
        (u) =>
          (u.email === identifier || u.mobile === identifier) &&
          u.password === password
      );
      if (!user) throw new Error("Invalid credentials. Try a demo account.");
      const { password: _pw, ...safe } = user;
      return { user: normalizeUser(safe), token: `demo-${safe.id}` };
    }
  },
  async verifyLoginOtp({ identifier, otp }) {
    const { data } = await client.post("/auth/verify-otp", { email: identifier, otp });
    const payload = data?.data || data;
    return {
      user: normalizeUser(payload.user),
      token: payload.token,
    };
  },
  async sendOtp(email) {
    const { data } = await client.post("/auth/send-otp", { email });
    return data?.data || data;
  },
  async sendSignupOtp(payload) {
    const { data } = await client.post("/auth/signup/send-otp", payload);
    return data?.data || data;
  },
  async verifySignupOtp(email, otp) {
    const { data } = await client.post("/auth/signup/verify-otp", { email, otp });
    const payload = data?.data || data;
    return { user: normalizeUser(payload.user), token: payload.token };
  },
  async sendPasswordResetOtp(email) {
    const { data } = await client.post("/auth/forgot-password", { email });
    return data?.data || data;
  },
  async verifyPasswordResetOtp(email, otp) {
    const { data } = await client.post("/auth/forgot-password/verify-otp", { email, otp });
    return data?.data || data;
  },
  async resetPassword(payload) {
    const { data } = await client.post("/auth/forgot-password/reset", payload);
    const response = data?.data || data;
    return { user: normalizeUser(response.user), token: response.token };
  },
  async register(payload) {
    try {
      const { data } = await client.post("/auth/register", {
        name: payload.name,
        email: payload.email,
        phone: payload.mobile,
        password: payload.password,
        role: payload.role,
        location: payload.location,
      });
      const response = data?.data || data;
      return {
        user: normalizeUser(response.user),
        token: response.token,
      };
    } catch (error) {
      if (error.response) throw error;
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
      return { user: normalizeUser(safe), token: `demo-${safe.id}` };
    }
  },
  async me() {
    try {
      const { data } = await client.get("/auth/me");
      return normalizeUser(data?.data || data);
    } catch {
      await delay(80);
      return readJSON(STORAGE_KEYS.user, null);
    }
  },
  async updateProfile(payload) {
    const { data } = await client.patch("/auth/profile", payload);
    return normalizeUser(data?.data || data);
  },
  async uploadProfileImage(file) {
    const formData = new FormData();
    formData.append("profileImage", file);
    const { data } = await client.post("/auth/profile/image", formData);
    return normalizeUser(data?.data || data);
  },
};

export default authApi;
