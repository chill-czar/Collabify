import api from "./axios";
import axios, { AxiosError } from "axios";

// Configure response interceptor for unified error handling
api.interceptors.response.use(
  (response) => {
    // Return successful response as-is
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config;

    // Retry logic for network errors or 5xx server errors
    if (
      config &&
      (!error.response || (error.response.status >= 500 && error.response.status < 600))
    ) {
      const retryCount = (config as any).__retryCount || 0;
      const maxRetries = 3;
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff

      if (retryCount < maxRetries) {
        (config as any).__retryCount = retryCount + 1;

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        console.log(`Retrying request (${retryCount + 1}/${maxRetries}):`, config.url);
        return api.request(config);
      }
    }

    // Format error for consistent handling
    const formattedError = {
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status,
      data: error.response?.data,
    };

    console.error("API Error:", formattedError);
    return Promise.reject(formattedError);
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
