import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuth } from "@clerk/nextjs";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth interceptor for requests
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

// Add auth error interceptor for responses
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    // Handle auth errors (401 Unauthorized, 403 Forbidden)
    if (status === 401 || status === 403) {
      if (typeof window !== "undefined") {
        const clerk = (window as any).__clerk;

        // Try to refresh the token
        if (clerk?.session && status === 401) {
          try {
            console.log("Attempting to refresh auth token...");
            const newToken = await clerk.session.getToken({ skipCache: true });

            if (newToken && error.config) {
              // Retry the request with the new token
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return api.request(error.config);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }
        }

        // If refresh fails or 403, trigger logout
        console.warn("Auth error, redirecting to sign-in...");
        if (clerk?.signOut) {
          await clerk.signOut();
        }
        // Redirect to sign-in page
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
