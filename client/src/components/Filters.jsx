import React from "react";

const Filters = ({
  filteredCategories = [],
  filteredBrands = [],
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  filterStockStatus,
  setFilterStockStatus,
}) => {
  return (
    <aside className="fixed top-[5.7rem] left-0 w-1/4 h-[calc(100vh-5.7rem)] p-4 bg-gray-100 hidden sm:block overflow-y-auto">
      <h2 className="mb-4 text-xl font-bold">Filters</h2>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-semibold">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
        >
          <option value="all">All Categories</option>
          {filteredCategories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="mb-4">
        <label className="block text-sm font-semibold">Brand</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
        >
          <option value="all">All Brands</option>
          {filteredBrands.map((brand, index) => (
            <option key={index} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Status Filter */}
      <div className="mb-4">
        <label className="block text-sm font-semibold">Stock Status</label>
        <select
          value={filterStockStatus}
          onChange={(e) => setFilterStockStatus(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
        >
          <option value="all">All Stock Levels</option>
          <option value="available">Available</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Stock Summary */}
      <div className="mt-6">
        <h3 className="mb-2 text-lg font-bold">Stock Summary</h3>
        <p>Total Products: {filteredCategories.length}</p>
        <p>Available: {filterStockStatus === "available" ? "..." : "..."}</p>
        <p>Low Stock: {filterStockStatus === "low" ? "..." : "..."}</p>
        <p>Out of Stock: {filterStockStatus === "out" ? "..." : "..."}</p>
      </div>
    </aside>
  );
};

export default Filters;
