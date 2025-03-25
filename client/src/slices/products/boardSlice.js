import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalProducts: 0,
  totalStockValue: 0,
  outOfStock: 0,
  allCategories: 0,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    updateTotalProducts: (state, action) => {
      if (action.payload && action.payload.deleted) {
        state.totalProducts -= 1; // Decrease total products when a product is deleted
      } else {
        state.totalProducts += 1; // Increase total products when a new product is added
      }
    },
    updateTotalStockValue: (state, action) => {
      if (action.payload && action.payload.products) {
        // Calculate total stock value based on the updated products
        state.totalStockValue = action.payload.products.reduce(
          (total, product) => total + product.value,
          0
        );
      }
    },
    updateOutOfStockCount: (state, action) => {
      if (action.payload && action.payload.products) {
        // Calculate the count of products that are out of stock (quantity is 0)
        state.outOfStock = action.payload.products.filter(
          (product) => product.quantity === 0
        ).length;
      }
    },
    updateCategories: (state, action) => {
      if (action.payload && action.payload.products) {
        // Calculate the count of unique categories based on the updated products
        const categoriesSet = new Set(
          action.payload.products.map((product) => product.category)
        );
        state.allCategories = categoriesSet.size;
      }
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