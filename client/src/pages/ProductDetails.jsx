// src/pages/ProductDetail.jsx

import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetProductByIdQuery } from "../features/api/apiSlice"; // Doğru API slice'ı kullanın

export default function ProductDetail() {
  const { id } = useParams();
  const { data, error, isLoading } = useGetProductByIdQuery(id);

  if (isLoading) return <p>Loading product details...</p>;
  if (error) return <p>Error loading product details.</p>;
  if (!data) return <p>Product not found.</p>;

  const { name, sku, categories, price, quantity, description, image } = data;

  return (
    <div className="flex flex-col justify-center w-[80vw] h-[85vh] mt-3">
      <div className="flex items-start justify-center w-[100%] h-[100%] gap-10">
        {/* Left Section */}
        <div className="bg-white rounded-lg shadow-lg w-[45%] h-[100%] flex flex-col gap-2 items-center justify-start">
          <div className="w-[95%]">
            <h2 className="text-2xl font-bold">Product</h2>
            <p className="font-bold border-t-2 border-b-2 border-gray-300">
              Products Availability :{" "}
              <span className="text-green-700 font-semibold">
                {quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </p>
          </div>

          <div className="h-[73vh] w-[95%]">
            <p>
              <b className="bg-red-500 p-1 mb-2 text-xl text-white">Name:</b>{" "}
              <span>{name}</span>
            </p>
            <p>
              <b>SKU: {sku}</b>
            </p>
            <p>
              <b>Categories:</b>{" "}
              <span className="text-gray-500 font-semibold ml-3">
                {categories}
              </span>
            </p>
            <p>
              <b>Price:</b>{" "}
              <span className="text-gray-500 font-semibold ml-3">#{price}</span>
            </p>
            <p>
              <b>Quantity in Stock:</b>{" "}
              <span className="text-gray-500 font-semibold ml-3">
                {quantity}
              </span>
            </p>
            <p className="border-b-2 border-gray-300">
              <b>Total value in Stock:</b>{" "}
              <span className="text-gray-500 font-semibold ml-3">
                #{price * quantity}
              </span>
            </p>
            <b>Description:</b>
            <p className="text-gray-500 font-semibold">{description}</p>
          </div>

          <Link to={`/dashboard/editproduct/${id}`}>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold text-center p-1 rounded mt-2 no-underline">
              Edit Product
            </button>
          </Link>
        </div>

        {/* Right Section */}
        <div className="w-[45%]">
          <p className="text-xl">Product Image:</p>
          <img
            src={image || "/path/to/default/image.jpg"}
            alt={`Image of ${name}`}
            className="h-[92%] w-[100%] object-cover"
          />
        </div>
      </div>
    </div>
  );
}
