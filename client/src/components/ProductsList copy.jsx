import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaPlusCircle, FaSearch, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../features/api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../features/api/products/productSlice";
import ConfirmDialog from "./ConfirmDialog";
import Filters from "./Filters";
import ProductItem from "./ProductItem";
import Pagination from "./Pagination";
import ProductModal from "./ProductModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const products = useSelector((state) => state.product.products);

  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [filterStockStatus, setFilterStockStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Debounced Search Handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1); // Reset to first page on search
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  // Fetch products and set them to Redux store
  useEffect(() => {
    if (error) {
      console.error("Error fetching products:", error);
      if (error.data && error.data.message) {
        toast.error(`Failed to load products: ${error.data.message}`);
      } else {
        toast.error("Failed to load products.");
      }
    }
  }, [error]);

  // Extract unique categories and brands for filters
  const allCategories = useMemo(
    () => [...new Set(products.map((p) => p.categoryId?.name).filter(Boolean))],
    [products]
  );
  const allBrands = useMemo(
    () => [...new Set(products.map((p) => p.brandId?.name).filter(Boolean))],
    [products]
  );

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) =>
        selectedCategory === "all"
          ? true
          : product.categoryId?.name === selectedCategory
      )
      .filter((product) =>
        selectedBrand === "all" ? true : product.brandId?.name === selectedBrand
      )
      .filter((product) => {
        if (filterStockStatus === "all") return true;
        if (filterStockStatus === "low")
          return product.quantity > 0 && product.quantity < 5;
        if (filterStockStatus === "available") return product.quantity >= 1;
        if (filterStockStatus === "out") return product.quantity === 0;
        return true;
      })
      .filter((product) =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [
    products,
    selectedCategory,
    selectedBrand,
    filterStockStatus,
    searchTerm,
  ]);

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Open Add/Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsAddingNewProduct(false);
    setModalOpen(true);
  };

  const openAddNewModal = () => {
    setEditingProduct(null);
    setIsAddingNewProduct(true);
    setModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  // Confirm Delete Product
  const confirmDeleteProduct = (product) => {
    setSelectedProductForDelete(product);
    setConfirmOpen(true);
  };

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!selectedProductForDelete) return;
    try {
      await deleteProduct(selectedProductForDelete._id).unwrap();
      toast.success("Product deleted successfully.");
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting the product:", error);
      toast.error("Failed to delete the product.");
    }
  };

  // Calculate Stock Summary
  const totalProducts = products.length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;
  const lowStockCount = products.filter(
    (p) => p.quantity > 0 && p.quantity < 5
  ).length;
  const availableCount = totalProducts - outOfStockCount - lowStockCount;

  if (isLoading) {
    return <p className="mt-20 text-center">Loading products...</p>;
  }

  if (error) {
    return (
      <p className="mt-20 text-center text-red-500">Error loading products.</p>
    );
  }

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Sticky Header */}
      <div className="fixed top-0 z-10 w-full bg-blue-500 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 text-white">
          <h1 className="text-3xl font-bold">Products ({totalProducts})</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white hover:text-blue-200"
          >
            <FaHome size={28} />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Filters */}
        <Filters
          filteredCategories={allCategories}
          filteredBrands={allBrands}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          filterStockStatus={filterStockStatus}
          setFilterStockStatus={setFilterStockStatus}
        />

        {/* Main Products Section */}
        <main className="w-full sm:w-3/4 h-screen overflow-y-auto sm:ml-[25%] mt-[5.7rem]">
          {/* Search and Add New Product Section */}
          <div className="fixed top-[5.7rem] w-full sm:w-[75%] z-50 flex items-center justify-between p-3 mb-4 bg-gray-100">
            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-blue-500 sm:hidden"
              >
                <FaSearch size={24} />
              </button>
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search products..."
                  onChange={handleSearchChange}
                  className="block w-full px-4 py-2 border rounded-lg sm:hidden focus:ring focus:ring-indigo-200"
                />
              )}
              <input
                type="text"
                placeholder="Search products..."
                onChange={handleSearchChange}
                className="hidden w-full px-4 py-2 border rounded-lg sm:block focus:ring focus:ring-indigo-200"
              />
            </div>
            {/* Add Product Button */}
            <button
              onClick={openAddNewModal}
              className="items-center hidden px-4 py-2 text-white bg-green-500 rounded-lg sm:flex hover:bg-green-600"
            >
              <FaPlusCircle className="inline-block mr-2" /> Add New Product
            </button>
          </div>

          {/* Product List */}
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 p-4 mt-20 sm:grid-cols-2 lg:grid-cols-3">
              {currentProducts.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  onEdit={() => openEditModal(product)}
                  onDelete={() => confirmDeleteProduct(product)}
                />
              ))}
            </div>
          ) : (
            <p className="mt-20 text-center text-gray-600">
              No products found for your search.
            </p>
          )}

          {/* Pagination */}
          {filteredProducts.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
            />
          )}
        </main>
      </div>

      {/* Add/Edit Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={closeModal}
        product={editingProduct}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        deleteProduct={handleDeleteProduct}
      />
    </>
  );
};

export default ProductsList;
