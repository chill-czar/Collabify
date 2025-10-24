import api from "./axios";
import { AxiosError } from "axios";

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => {
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
        originalError: error,
      });
    }

    // Handle rate limiting (429)
    if (error.response.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 1000;

      console.warn(`Rate limited. Retrying after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));

      return api.request(originalRequest);
    }

    // Retry logic for server errors (500-599) - max 2 retries
    if (
      error.response.status >= 500 &&
      error.response.status < 600 &&
      (!originalRequest._retryCount || originalRequest._retryCount < 2)
    ) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, originalRequest._retryCount - 1), 5000);
      console.warn(`Server error. Retrying in ${delay}ms (attempt ${originalRequest._retryCount}/2)`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return api.request(originalRequest);
    }

    // For all other errors, reject with formatted error
    const errorMessage =
      (error.response.data as any)?.message ||
      (error.response.data as any)?.error ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject({
      status: error.response.status,
      message: errorMessage,
      originalError: error,
    });
  }
);

// Request batching utility for multi-file operations
interface BatchRequest {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  body?: any;
  params?: any;
}

interface BatchResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  index: number;
}

/**
 * Batch multiple file requests into a single API call
 * This reduces the number of HTTP requests for operations like bulk file updates or deletions
 */
export async function batchFileRequests<T = any>(
  requests: BatchRequest[]
): Promise<BatchResponse<T>[]> {
  try {
    // Send all requests to a batch endpoint
    const res = await api.post<{ results: BatchResponse<T>[] }>("/batch", {
      requests,
    });
    return res.data.results;
  } catch (error) {
    // If batch endpoint fails, fall back to individual requests
    console.warn("Batch request failed, falling back to individual requests");
    return Promise.all(
      requests.map(async (req, index) => {
        try {
          let response;
          switch (req.method) {
            case "GET":
              response = await api.get(req.url, { params: req.params });
              break;
            case "POST":
              response = await api.post(req.url, req.body);
              break;
            case "PATCH":
              response = await api.patch(req.url, req.body);
              break;
            case "DELETE":
              response = await api.delete(req.url);
              break;
          }
          return {
            success: true,
            data: response.data,
            index,
          };
        } catch (err: any) {
          return {
            success: false,
            error: err.message || "Request failed",
            index,
          };
        }
      })
    );
  }
}

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

  // Export batch utility as part of apiClient
  batch: batchFileRequests,
};
