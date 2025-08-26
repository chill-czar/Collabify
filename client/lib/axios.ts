import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth interceptor
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      try {
        console.log("Clerk instance:", (window as any).__clerk);
        const clerk = (window as any).__clerk;
        if (clerk?.session) {
          const token = await clerk.session.getToken();
          console.log("Got token:", token ? "YES" : "NO");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } else {
          console.log("No clerk session available");
        }
      } catch (error) {
        console.warn("Failed to get auth token:", error);
      }
    }
    console.log("Final request headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
