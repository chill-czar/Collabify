import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api", // Fallback to Next.js API routes
  withCredentials: true, // Send cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (e.g., attach auth token)
// api.interceptors.request.use(
//   (config) => {
//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("access_token")
//         : null;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response Interceptor (e.g., refresh token or handle errors)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized — redirecting to login...");
//       // Optionally: trigger logout or refresh flow
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
