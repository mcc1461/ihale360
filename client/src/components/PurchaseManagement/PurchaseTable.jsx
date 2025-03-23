// PurchaseTable.jsx
import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function PurchaseTable({ purchases, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Date",
              "Firm",
              "Category",
              "Brand",
              "Product",
              "Image",
              "Purchased By",
              "Quantity",
              "Price",
              "Amount",
              "Notes",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {purchases.map((purchase) => (
            <tr key={purchase._id}>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {purchase.date
                  ? new Date(purchase.date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {purchase.firmId?.name || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {purchase.categoryId?.name || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {purchase.brandId?.name || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {purchase.productId?.name || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {purchase.productId?.imageUrl && (
                  <img
                    src={purchase.productId.imageUrl}
                    alt={purchase.productId.name}
                    className="object-cover w-10 h-10"
                  />
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {purchase.purchasedById?.username || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {purchase.quantity}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                ${purchase.price}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                ${purchase.amount}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {purchase.notes}
              </td>
              <td className="flex px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                <button
                  onClick={() => onEdit(purchase)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(purchase)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
