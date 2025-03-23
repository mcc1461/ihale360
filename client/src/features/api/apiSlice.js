// src/features/api/apiSlice.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../auth/authSlice";

// Set BASE_URL to match your backend's root
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8061";

console.log("BASE_URL:", BASE_URL);

// Define the baseQuery with authentication headers
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // Include cookies if needed
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrapper to handle token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If unauthorized, attempt to refresh the token
  if (result.error && result.error.status === 401 && !args._retry) {
    args._retry = true;
    console.warn("API received 401, attempting token refresh");

    // Attempt to refresh the token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken: api.getState().auth.refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { bearer, user } = refreshResult.data; // Ensure backend sends 'user' along with tokens
      const { accessToken, refreshToken } = bearer;

      // Update the store with new credentials
      api.dispatch(setCredentials({ user, token: accessToken, refreshToken }));

      // Retry the original query with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Logout the user if token refresh fails
      api.dispatch(logout());
      // Optionally, navigate to login page or show a message
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "User", "Brand", "Category", "Firm"],
  endpoints: (builder) => ({
    // Products Endpoints
    getProducts: builder.query({
      query: () => "/api/products",
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/api/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation({
      query: (updatedProduct) => ({
        url: `/api/products/${updatedProduct._id}`,
        method: "PUT",
        body: updatedProduct,
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: "Product", id: _id },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // User Authentication Endpoints
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    // Add more endpoints as needed
  }),
});

// Export hooks for usage in functional components
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useLoginUserMutation,
  useRegisterUserMutation,
  useRefreshTokenMutation,
} = apiSlice;

export default apiSlice;
