// src/features/api/products/boardSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalProducts: 0,
  totalStockValue: 0,
  outOfStock: 0,
  allCategories: 0,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateTotalProducts: (state, action) => {
      state.totalProducts = action.payload;
    },
    updateTotalStockValue: (state, action) => {
      state.totalStockValue = action.payload;
    },
    updateOutOfStockCount: (state, action) => {
      state.outOfStock = action.payload;
    },
    updateCategories: (state, action) => {
      state.allCategories = action.payload;
    },
  },
});

export const {
  updateTotalProducts,
  updateTotalStockValue,
  updateOutOfStockCount,
  updateCategories,
} = boardSlice.actions;

export default boardSlice.reducer;
