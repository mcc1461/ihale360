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
    setTotalProducts: (state, action) => {
      state.totalProducts = action.payload;
    },
    setTotalStockValue: (state, action) => {
      state.totalStockValue = action.payload;
    },
    setOutOfStockCount: (state, action) => {
      state.outOfStock = action.payload;
    },
    setCategories: (state, action) => {
      state.allCategories = action.payload;
    },
  },
});

export const {
  setTotalProducts,
  setTotalStockValue,
  setOutOfStockCount,
  setCategories,
} = boardSlice.actions;

export default boardSlice.reducer;
