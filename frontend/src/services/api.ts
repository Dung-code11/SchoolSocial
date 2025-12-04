import axios from "axios";
import { getToken } from "../utils/storage";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Interceptor gắn token vào header
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
