import api from "./axios";

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
