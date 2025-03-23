// src/pages/Board.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTotalProducts,
  setTotalStockValue,
  setOutOfStockCount,
  setCategories,
} from "../features/api/products/boardSlice";

import { BsListCheck } from "react-icons/bs";
import { GiShoppingCart } from "react-icons/gi";
import { TbCurrencyNaira, TbShoppingCartX } from "react-icons/tb";
import Table from "../components/Table";

export default function Board() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  const totalProducts = useSelector((state) => state.board.totalProducts);
  const totalStockValue = useSelector((state) => state.board.totalStockValue);
  const outOfStockCount = useSelector((state) => state.board.outOfStock);
  const categories = useSelector((state) => state.board.allCategories);

  useEffect(() => {
    if (!Array.isArray(products)) {
      console.error("Products data is not an array:", products);
      return;
    }

    console.log("Products:", products); // Ürün verilerini kontrol etmek için

    const updatedTotalProducts = products.length;

    // Safeguard to ensure product.price and product.quantity are valid numbers
    const updatedTotalStockValue = products.reduce((total, product) => {
      const price = Number(product?.price);
      const quantity = Number(product?.quantity);

      if (isNaN(price) || isNaN(quantity)) {
        console.warn(
          `Invalid price or quantity for product ID ${product?._id}:`,
          product?.price,
          product?.quantity
        );
        return total;
      }
      return total + price * quantity;
    }, 0);

    const updatedOutOfStockCount = products.filter(
      (product) => product?.quantity === 0
    ).length;

    const uniqueCategories = [
      ...new Set(
        products.map((product) => product?.categoryId?.name).filter(Boolean)
      ),
    ];
    const updatedCategories = uniqueCategories.length;

    // Dispatch the updates to the Redux store
    dispatch(setTotalProducts(updatedTotalProducts));
    dispatch(setTotalStockValue(updatedTotalStockValue));
    dispatch(setOutOfStockCount(updatedOutOfStockCount));
    dispatch(setCategories(updatedCategories));
  }, [dispatch, products]);

  return (
    <div className="w-full flex flex-col items-center justify-between h-[85vh]">
      <div className="flex items-center justify-between h-[20%] w-[97%] text-white">
        <button className="w-[20%] h-[90%] rounded-xl bg-[#0F1377] flex items-center justify-evenly transition ease-in-out delay-150 hover:-translate-1 hover:scale-110 hover:bg-[#0F1377] duration-300">
          <div>
            <GiShoppingCart className="text-4xl font-semibold" />
          </div>
          <div className="text-center">
            <p>Total Products</p>
            <p>{totalProducts}</p>
          </div>
        </button>
        <button className="w-[20%] h-[90%] rounded-xl bg-[#0A6502] flex items-center justify-evenly transition ease-in-out delay-150 hover:-translate-1 hover:scale-110 hover:bg-[#0A6502] duration-300">
          <div>
            <TbCurrencyNaira className="text-4xl" />
          </div>
          <div className="text-center">
            <p>Total Stock Value</p>
            <p>{totalStockValue}</p>
          </div>
        </button>
        <button className="w-[20%] h-[90%] rounded-xl bg-[#850707] flex items-center justify-evenly transition ease-in-out delay-150 hover:-translate-1 hover:scale-110 hover:bg-[#850707] duration-300">
          <div>
            <TbShoppingCartX className="text-4xl" />
          </div>
          <div className="text-center">
            <p>Out of Stock</p>
            <p>{outOfStockCount}</p>
          </div>
        </button>
        <button className="w-[20%] h-[90%] rounded-xl bg-[#530441] flex items-center justify-evenly transition ease-in-out delay-150 hover:-translate-1 hover:scale-110 hover:bg-[#530441] duration-300">
          <div>
            <BsListCheck className="text-4xl " />
          </div>
          <div className="text-center">
            <p>All Categories</p>
            <p>{categories}</p>
          </div>
        </button>
      </div>

      <div className="h-[75%] w-[98%]">
        <Table />
      </div>
    </div>
  );
}
