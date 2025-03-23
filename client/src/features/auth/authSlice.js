// src/features/auth/authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null, // Include refreshToken
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user || state.user;
      state.token = token || state.token;
      state.refreshToken = refreshToken || state.refreshToken;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      if (token) {
        localStorage.setItem("token", token);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
