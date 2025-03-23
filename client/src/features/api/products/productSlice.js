// src/features/api/products/productSlice.js

import { createSlice } from "@reduxjs/toolkit";

// Initial state for the product slice
const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      const newProduct = action.payload;
      if (newProduct && newProduct._id) {
        state.products.push(newProduct);
      } else {
        console.error(
          "addProduct action payload must be a product object with an '_id' field. Received:",
          action.payload
        );
      }
    },
    updateProduct: (state, action) => {
      const { id, updatedProduct } = action.payload;

      if (!id || !updatedProduct) {
        console.error(
          "updateProduct action payload must contain 'id' and 'updatedProduct'. Received:",
          action.payload
        );
        return;
      }

      const productIndex = state.products.findIndex(
        (product) => product._id === id
      );

      if (productIndex !== -1) {
        state.products[productIndex] = {
          ...state.products[productIndex],
          ...updatedProduct,
        };
      } else {
        console.warn(
          `updateProduct: No product found with _id '${id}'. Update skipped.`
        );
      }
    },
    deleteProduct: (state, action) => {
      const id = action.payload;

      if (!id) {
        console.error(
          "deleteProduct action payload must be the '_id' of the product to delete. Received:",
          action.payload
        );
        return;
      }

      const initialLength = state.products.length;
      state.products = state.products.filter((product) => product._id !== id);

      if (state.products.length === initialLength) {
        console.warn(
          `deleteProduct: No product found with _id '${id}'. Deletion skipped.`
        );
      }
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } =
  productSlice.actions;

export default productSlice.reducer;
