import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 12000,
});

client.interceptors.request.use((config) => {
  const raw = localStorage.getItem("krishiq_user");
  if (raw) {
    try {
      const user = JSON.parse(raw);
      config.headers.Authorization = `Bearer demo-${user.id}`;
    } catch {
      /* ignore */
    }
  }
  return config;
});

export default client;
