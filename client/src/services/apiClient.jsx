// src/services/apiClient.jsx

import axios from "axios";

// Create an Axios instance with the base URL from environment variables
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL, // Ensure this is correctly set in your environment variables
});
console.log("API Base URL:", apiClient.defaults.baseURL);

// Add a request interceptor to include the token in all requests except auth-related ones
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the 'token' and 'refreshToken' from localStorage
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const userStr = localStorage.getItem("user");

    console.log("Token retrieved from localStorage:", token);
    console.log("Refresh Token retrieved from localStorage:", refreshToken);

    // If a token exists, set the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set:", config.headers.Authorization);
    } else {
      console.log("No token found; Authorization header not set.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 Unauthorized errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Client Error:", error);

    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Redirecting to login.");

      // Clear user information from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Redirect to the login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
