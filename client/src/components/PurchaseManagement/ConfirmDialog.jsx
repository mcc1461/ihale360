// ConfirmDialog.jsx
import React from "react";

export default function ConfirmDialog({
  confirmOpen,
  setConfirmOpen,
  deleteProduct,
}) {
  if (!confirmOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded shadow-lg w-96">
        <h3 className="mb-4 text-xl font-bold">Confirm Deletion</h3>
        <p className="mb-6">Are you sure you want to delete this purchase?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={deleteProduct}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirmOpen(false)}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
