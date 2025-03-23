// src/pages/Products.jsx

import React from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const { error, isLoading } = useGetProductsQuery();
  const products = data || []; // Default to empty array if data is undefined

  // Arama terimi state
  const [searchTerm, setSearchTerm] = React.useState("");

  // Filtrelenmiş ürünler
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products...</p>;
  if (!products || products.length === 0) return <p>No products available</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Quantity</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Brand</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="py-2 px-4 border">{product.name}</td>
                <td className="py-2 px-4 border">{product.price}</td>
                <td className="py-2 px-4 border">{product.quantity}</td>
                <td className="py-2 px-4 border">{product.categoryId?.name}</td>
                <td className="py-2 px-4 border">{product.brandId?.name}</td>
                <td className="py-2 px-4 border">
                  {/* Action buttons (Edit, Delete) */}
                  <Link to={`/dashboard/editproduct/${product._id}`}>
                    <button className="text-blue-500 hover:underline mr-2">
                      Edit
                    </button>
                  </Link>
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
