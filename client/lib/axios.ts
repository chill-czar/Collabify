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

// Add auth error handling interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        try {
          const clerk = (window as any).__clerk;

          // Try to refresh the token
          if (clerk?.session) {
            const newToken = await clerk.session.getToken({ skipCache: true });
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          }

          // If refresh fails, redirect to sign-in
          console.error("Session expired. Redirecting to sign-in...");
          window.location.href = "/sign-in";
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          window.location.href = "/sign-in";
        }
      }
    }

    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.error("Access forbidden. Insufficient permissions.");
      // You can show a toast notification or redirect to an error page
      if (typeof window !== "undefined") {
        // Optional: show a user-friendly error message
        const event = new CustomEvent("auth:forbidden", {
          detail: { message: "You don't have permission to access this resource" },
        });
        window.dispatchEvent(event);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
