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

/**
 * Request batching utility for handling multiple file operations in a single call
 * This reduces the number of round trips to the server and improves performance
 */
export interface BatchFileRequest {
  fileId: string;
  operation: "read" | "update" | "delete";
  payload?: any;
}

export interface BatchFileResponse {
  fileId: string;
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Batch multiple file requests into a single API call
 * @param requests - Array of file requests to batch
 * @returns Array of responses for each request
 */
export const batchFileRequests = async (
  requests: BatchFileRequest[]
): Promise<BatchFileResponse[]> => {
  try {
    const response = await apiClient.post<{ results: BatchFileResponse[] }>(
      "/files/bulk",
      { requests }
    );
    return response.results;
  } catch (error) {
    console.error("Batch file requests failed:", error);
    throw error;
  }
};

/**
 * Helper function to batch file reads
 */
export const batchFileReads = async (fileIds: string[]) => {
  const requests: BatchFileRequest[] = fileIds.map((fileId) => ({
    fileId,
    operation: "read",
  }));
  return batchFileRequests(requests);
};

/**
 * Helper function to batch file updates
 */
export const batchFileUpdates = async (
  updates: Array<{ fileId: string; payload: any }>
) => {
  const requests: BatchFileRequest[] = updates.map(({ fileId, payload }) => ({
    fileId,
    operation: "update",
    payload,
  }));
  return batchFileRequests(requests);
};

/**
 * Helper function to batch file deletes
 */
export const batchFileDeletes = async (fileIds: string[]) => {
  const requests: BatchFileRequest[] = fileIds.map((fileId) => ({
    fileId,
    operation: "delete",
  }));
  return batchFileRequests(requests);
};
