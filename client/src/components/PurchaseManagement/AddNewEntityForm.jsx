// AddNewEntityForm.jsx
import React, { useState } from "react";

const AddNewEntityForm = ({ entityType, onAdd, onCancel }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // Only for Product

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      alert(`Please enter a ${entityType} name.`);
      return;
    }
    onAdd({ name, image });
  };

  return (
    <div className="p-4 mb-4 bg-gray-100 border rounded">
      <h3 className="mb-2 text-lg font-semibold">Add New {entityType}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter ${entityType} name`}
            className="w-full p-2 border rounded"
          />
        </div>
        {entityType === "Product" && (
          <div className="mb-2">
            <label className="block mb-1 font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewEntityForm;
