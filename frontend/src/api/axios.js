import axios from "axios";

function buildBaseURL() {
  const raw =
    (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? "")
      .toString()
      .trim();

  if (!raw) return "/api";

  const cleaned = raw.replace(/\/+$/, "");
  return cleaned.endsWith("/api") ? cleaned : `${cleaned}/api`;
}

const client = axios.create({
  baseURL: buildBaseURL(),
  timeout: 12000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("krishiq_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
