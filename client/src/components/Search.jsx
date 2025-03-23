// src/components/Search.jsx

import React from "react";

export default function Search({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search products..."
      className="w-full px-3 py-2 border rounded"
    />
  );
}
