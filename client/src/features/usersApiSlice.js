// src/slices/usersApiSlice.js

import { apiSlice } from "./api/apiSlice";

const USERS_URL = "http://127.0.0.1:8061/api";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth/login`,
        method: "POST",
        body: data,
      }),
    }),

    // Register
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth/register`, // Adjust if your server expects /register
        method: "POST",
        body: data,
      }),
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/auth/logout`,
        method: "POST", // Adjust to 'GET' if your server expects it
      }),
    }),

    // Update User Profile
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updateProfile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Get User Profile
    profile: builder.query({
      query: () => ({
        url: `${USERS_URL}/me`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/users/forgotPassword`,
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ data, resetToken }) => ({
        url: `${USERS_URL}/users/reset-password/${resetToken}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Report Issues
    reportIssues: builder.mutation({
      query: (data) => ({
        url: `/contactUs`,
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useProfileQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useReportIssuesMutation,
} = usersApiSlice;
