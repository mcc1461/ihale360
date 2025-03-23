// src/utils/BoardStats.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../features/api/products/productSlice";
import {
  updateTotalProducts,
  updateTotalStockValue,
  updateOutOfStockCount,
  updateCategories,
} from "../features/api/products/boardSlice";

export default function BoardStats() {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetProductsQuery();
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      // API yanıt yapınıza göre düzenleyin
      dispatch(setProducts(data.data));
    }
    if (error) {
      console.error("Error fetching products:", error);
    }
  }, [data, error, dispatch]);

  // Board bileşeninizdeki useEffect ile aynı hesaplamaları burada yapabilirsiniz
}
