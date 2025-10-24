import axios, { AxiosError } from "axios";
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

// Add response interceptor for auth error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._authRetry) {
      originalRequest._authRetry = true;

      if (typeof window !== "undefined") {
        try {
          const clerk = (window as any).__clerk;

          if (clerk?.session) {
            // Try to refresh the token
            const newToken = await clerk.session.getToken({ skipCache: true });

            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          }

          // If refresh fails, redirect to login
          console.warn("Authentication failed, redirecting to login");
          window.location.href = "/login";
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          window.location.href = "/login";
        }
      }
    }

    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.error("Access forbidden: Insufficient permissions");
      // You can show a toast notification here
      if (typeof window !== "undefined") {
        // Optionally redirect to a forbidden page or show error
        const errorMessage =
          (error.response.data as any)?.message ||
          "You don't have permission to access this resource";
        console.error(errorMessage);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
