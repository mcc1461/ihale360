import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [], // An array to store products, you can modify this based on your data structure
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      // Set the products in the state based on the action payload
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      // Add a new product to the products array
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      // Find and update a product in the array
      const { id, updatedProduct } = action.payload;
      const productIndex = state.products.findIndex(product => product?.id === id);
      if (productIndex !== -1) {
        state.products[productIndex] = updatedProduct;
      }
    },
    deleteProduct: (state, action) => {
      // Remove a product from the array
      const id = action.payload;
      state.products = state.products.filter(product => product.id !== id);
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;