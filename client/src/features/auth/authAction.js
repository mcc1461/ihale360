// src/features/auth/authActions.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loginSuccess, logout } from "./authSlice";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      // API yanıtınıza göre düzenleyin
      dispatch(
        loginSuccess({
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        })
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Logout işlemi zaten authSlice'da tanımlı
