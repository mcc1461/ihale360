import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ProductItem = ({ product, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  // Determine stock status
  let label = "In Stock";
  let labelStyle = "bg-green-500";
  if (product.quantity === 0) {
    label = "Out of Stock";
    labelStyle = "bg-red-500";
  } else if (product.quantity < 5) {
    label = "Low Stock";
    labelStyle = "bg-yellow-500";
  }

  return (
    <div
      className={`relative p-4 rounded-lg shadow-md ${
        product.quantity === 0
          ? "bg-red-100"
          : product.quantity < 5
          ? "bg-yellow-100"
          : "bg-gray-50"
      } transition-transform duration-300 transform hover:scale-105`}
    >
      {/* Stock Badge */}
      <div className="absolute top-2 left-2">
        <span
          className={`px-2 py-1 text-xs font-semibold text-white rounded ${labelStyle}`}
        >
          {label}
        </span>
      </div>

      {/* Product Image */}
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.name}
        className="object-contain w-full h-56 p-4 bg-white rounded-md"
      />

      <div className="p-6">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">Quantity: {product.quantity}</p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-500 hover:text-indigo-600"
          >
            {expanded ? "Hide Details" : "View Details"}
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
        {expanded && (
          <div className="mt-4">
            <p className="text-gray-600">
              Brand: {product.brandId?.name || "N/A"}
            </p>
            <p className="text-gray-600">
              Category: {product.categoryId?.name || "N/A"}
            </p>
            <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
