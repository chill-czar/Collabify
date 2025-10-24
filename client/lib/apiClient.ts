import api from "./axios";
import { AxiosError, AxiosResponse } from "axios";

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful responses as-is
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject({
        message: "Network error. Please check your connection.",
        code: "NETWORK_ERROR",
      });
    }

    // Handle rate limiting (429) with retry
    if (error.response.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      const retryAfter = error.response.headers["retry-after"];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 2000;

      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(originalRequest);
    }

    // Handle server errors (5xx) with retry
    if (
      error.response.status >= 500 &&
      error.response.status < 600 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      // Only retry up to 2 times
      if (originalRequest._retryCount <= 2) {
        const delay = Math.pow(2, originalRequest._retryCount) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(originalRequest);
      }
    }

    // Enhance error message
    const errorMessage =
      (error.response.data as any)?.message ||
      (error.response.data as any)?.error ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject({
      message: errorMessage,
      status: error.response.status,
      code: (error.response.data as any)?.code || "API_ERROR",
      data: error.response.data,
    });
  }
);

export const apiClient = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    const res = await api.get<T>(url, { params });
    return res.data;
  },

  post: async <T>(url: string, body?: any): Promise<T> => {
    // If body is FormData, let Axios set the headers automatically
    if (body instanceof FormData) {
      const res = await api.post<T>(url, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    }
    // Default JSON post
    const res = await api.post<T>(url, body);
    return res.data;
  },

  patch: async <T>(url: string, body?: any): Promise<T> => {
    const res = await api.patch<T>(url, body);
    return res.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const res = await api.delete<T>(url);
    return res.data;
  },
};
