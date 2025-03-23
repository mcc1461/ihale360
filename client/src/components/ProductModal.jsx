// src/components/ProductModal.jsx

import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../features/api/apiSlice"; // Updated import path
import { toast } from "react-toastify";

export default function ProductModal({ isOpen, onClose, product }) {
  const [editingProduct, setEditingProduct] = useState(product || {});

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  useEffect(() => {
    setEditingProduct(product || {});
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({ ...prev, [name]: value }));
  };

  const saveProductDetails = async () => {
    try {
      if (!editingProduct._id) {
        // Create new product
        await addProduct(editingProduct).unwrap();
        toast.success("Product created successfully.");
      } else {
        // Update existing product
        await updateProduct(editingProduct).unwrap();
        toast.success("Product updated successfully.");
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product.");
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClose={onClose}
      >
        <div className="p-8 bg-white rounded-lg shadow-lg w-96">
          <h2 className="mb-4 text-2xl font-bold">
            {editingProduct._id ? "Edit Product" : "Add New Product"}
          </h2>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={editingProduct.name || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={editingProduct.price || 0}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={editingProduct.quantity || 0}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Category</label>
            <input
              type="text"
              name="categoryId"
              value={editingProduct.categoryId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Brand</label>
            <input
              type="text"
              name="brandId"
              value={editingProduct.brandId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={saveProductDetails}
              disabled={isAdding || isUpdating}
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
            >
              {isAdding || isUpdating ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
