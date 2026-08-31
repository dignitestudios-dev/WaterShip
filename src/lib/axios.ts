import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { getCookie, removeCookie } from "./cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.dev.watership.app",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

const getDeviceUniqueId = () => {
  if (typeof window === "undefined") return "server-id";
  let id = localStorage.getItem("deviceuniqueid");
  if (!id) {
    id = "device_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("deviceuniqueid", id);
  }
  return id;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Auth requirements for this specific backend
    config.headers["deviceuniqueid"] = getDeviceUniqueId();
    config.headers["devicemodel"] = typeof window !== "undefined" ? navigator.userAgent : "Server";

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeCookie("token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
