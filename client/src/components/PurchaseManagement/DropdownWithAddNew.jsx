// DropdownWithAddNew.jsx
import React from "react";
import PropTypes from "prop-types";

export default function DropdownWithAddNew({
  label,
  options,
  value,
  onChange,
  isAddingNew,
  setIsAddingNew,
  newEntryName,
  setNewEntryName,
  onAddNew,
  noOptionsMessage,
}) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">{label}</label>
      {isAddingNew ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newEntryName}
            onChange={(e) => setNewEntryName(e.target.value)}
            placeholder={`Enter new ${label} name`}
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={onAddNew}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAddingNew(false);
              setNewEntryName("");
            }}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <select
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className="w-full p-2 border rounded"
          >
            <option value="">{`Select ${label}`}</option>
            {options.length > 0 ? (
              options.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {noOptionsMessage || `No ${label}s Available`}
              </option>
            )}
          </select>
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="mt-2 text-blue-500 hover:underline"
          >
            + Add New {label}
          </button>
        </div>
      )}
    </div>
  );
}

DropdownWithAddNew.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isAddingNew: PropTypes.bool.isRequired,
  setIsAddingNew: PropTypes.func.isRequired,
  newEntryName: PropTypes.string.isRequired,
  setNewEntryName: PropTypes.func.isRequired,
  onAddNew: PropTypes.func.isRequired,
  noOptionsMessage: PropTypes.string,
};
