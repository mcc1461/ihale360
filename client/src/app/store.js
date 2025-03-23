// src/app/store.js

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import authReducer from "../features/auth/authSlice";
// Remove productReducer import if productSlice.js is deleted
// import productReducer from "../features/api/products/productSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web

// Persist configuration for auth slice
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist the auth slice
};

// Create a persisted reducer for auth
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query API slice
    auth: persistedAuthReducer, // Persisted auth slice
    // Remove product slice if not needed
    // product: productReducer, // Remove if necessary
    // Add other reducers here if needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware), // Add RTK Query middleware
});

export const persistor = persistStore(store);
