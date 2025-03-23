// PurchaseForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import DropdownWithAddNew from "./DropdownWithAddNew";
import apiClient from "../../services/apiClient"; // Ensure this is correctly set up
import PropTypes from "prop-types"; // Optional: For prop type validation

export default function PurchaseForm({
  categories, // Array of category objects
  firms, // Array of firm objects
  brands, // Array of brand objects
  products, // Array of product objects
  editingPurchase, // Object containing purchase details if editing
  setEditingPurchase, // Function to update purchase details
  closeModal, // Function to close the modal
  handleSavePurchase, // Function to handle saving the purchase
  currentUserRole, // String indicating the current user's role
  currentUserId, // String indicating the current user's ID
  users, // Array of user objects
}) {
  // Ensure data is loaded before rendering
  if (!firms || !categories || !brands || !products) {
    return <div>Loading...</div>;
  }

  // Selection states
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // States for adding new entries
  const [isAddingNewFirm, setIsAddingNewFirm] = useState(false);
  const [newFirmName, setNewFirmName] = useState("");

  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductImage, setNewProductImage] = useState(null);

  // State for calculation totals
  const [totalProductsPurchased, setTotalProductsPurchased] = useState(0);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);

  // Initialize selections if editing
  useEffect(() => {
    if (editingPurchase) {
      setSelectedFirm(editingPurchase.firmId || null);
      setSelectedCategory(editingPurchase.categoryId || null);
      setSelectedBrand(editingPurchase.brandId || null);
      setSelectedProduct(editingPurchase.productId || null);
      // Initialize totals
      setTotalProductsPurchased(editingPurchase.quantity || 0);
      setTotalAmountPaid(editingPurchase.amount || 0);
    } else {
      setSelectedFirm(null);
      setSelectedCategory(null);
      setSelectedBrand(null);
      setSelectedProduct(null);
      setTotalProductsPurchased(0);
      setTotalAmountPaid(0);
    }
  }, [editingPurchase]);

  // Memoized filtered lists based on hierarchical relationships
  const filteredCategories = useMemo(() => {
    if (selectedFirm) {
      const filtered = categories.filter(
        (category) => String(category.firmId) === String(selectedFirm)
      );
      console.log("Filtered Categories based on Firm:", filtered);
      return filtered;
    }
    console.log("All Categories:", categories);
    return categories;
  }, [selectedFirm, categories]);

  const filteredBrands = useMemo(() => {
    let brandsToFilter = brands;

    if (selectedFirm) {
      const firmCategoryIds = categories
        .filter((category) => String(category.firmId) === String(selectedFirm))
        .map((category) => category._id);
      brandsToFilter = brands.filter((brand) =>
        firmCategoryIds.includes(brand.categoryId)
      );
    }

    if (selectedCategory) {
      brandsToFilter = brandsToFilter.filter(
        (brand) => String(brand.categoryId) === String(selectedCategory)
      );
    }

    console.log("Filtered Brands:", brandsToFilter);
    return brandsToFilter;
  }, [selectedFirm, selectedCategory, categories, brands]);

  const filteredProducts = useMemo(() => {
    let productsToFilter = products;

    if (selectedFirm) {
      const firmCategoryIds = categories
        .filter((category) => String(category.firmId) === String(selectedFirm))
        .map((category) => category._id);

      const firmBrandIds = brands
        .filter((brand) => firmCategoryIds.includes(brand.categoryId))
        .map((brand) => brand._id);

      productsToFilter = products.filter((product) =>
        firmBrandIds.includes(product.brandId)
      );
    }

    if (selectedCategory) {
      const categoryBrandIds = brands
        .filter(
          (brand) => String(brand.categoryId) === String(selectedCategory)
        )
        .map((brand) => brand._id);

      productsToFilter = productsToFilter.filter((product) =>
        categoryBrandIds.includes(product.brandId)
      );
    }

    if (selectedBrand) {
      productsToFilter = productsToFilter.filter(
        (product) => String(product.brandId) === String(selectedBrand)
      );
    }

    console.log("Filtered Products:", productsToFilter);
    return productsToFilter;
  }, [
    selectedFirm,
    selectedCategory,
    selectedBrand,
    categories,
    brands,
    products,
  ]);

  // Calculations based on selected Firm
  useEffect(() => {
    if (!selectedFirm) {
      setTotalProductsPurchased(0);
      setTotalAmountPaid(0);
      return;
    }

    // Example calculation with 'editingPurchase' only
    if (
      editingPurchase &&
      filteredProducts.some(
        (product) => product._id === editingPurchase.productId
      )
    ) {
      setTotalProductsPurchased(Number(editingPurchase.quantity) || 0);
      setTotalAmountPaid(Number(editingPurchase.amount) || 0);
    } else {
      setTotalProductsPurchased(0);
      setTotalAmountPaid(0);
    }
  }, [selectedFirm, filteredProducts, editingPurchase]);

  // Handlers for adding new entries
  const handleAddNewFirm = async () => {
    if (newFirmName.trim() === "") {
      alert("Firm name cannot be empty.");
      return;
    }

    try {
      const response = await apiClient.post("/dashboard/firms", {
        name: newFirmName,
      });
      const newFirm = response.data?.data;
      if (newFirm) {
        setSelectedFirm(newFirm._id);
        setIsAddingNewFirm(false);
        setNewFirmName("");
        console.log("Added new Firm:", newFirm);
        // Optionally, refresh firms list or append the new firm
      }
    } catch (error) {
      console.error("Error adding new Firm:", error);
      alert("Failed to add new Firm.");
    }
  };

  const handleAddNewCategory = async () => {
    if (newCategoryName.trim() === "") {
      alert("Category name cannot be empty.");
      return;
    }

    if (!selectedFirm) {
      alert("Please select a Firm before adding a Category.");
      return;
    }

    try {
      const response = await apiClient.post("/api/categories", {
        name: newCategoryName,
        firmId: selectedFirm,
      });
      const newCategory = response.data?.data;
      if (newCategory) {
        setSelectedCategory(newCategory._id);
        setIsAddingNewCategory(false);
        setNewCategoryName("");
        console.log("Added new Category:", newCategory);
        // Optionally, refresh categories list or append the new category
      }
    } catch (error) {
      console.error("Error adding new Category:", error);
      alert("Failed to add new Category.");
    }
  };

  const handleAddNewBrand = async () => {
    if (newBrandName.trim() === "") {
      alert("Brand name cannot be empty.");
      return;
    }

    if (!selectedCategory) {
      alert("Please select a Category before adding a Brand.");
      return;
    }

    try {
      const response = await apiClient.post("/api/brands", {
        name: newBrandName,
        categoryId: selectedCategory,
      });
      const newBrand = response.data?.data;
      if (newBrand) {
        setSelectedBrand(newBrand._id);
        setIsAddingNewBrand(false);
        setNewBrandName("");
        console.log("Added new Brand:", newBrand);
        // Optionally, refresh brands list or append the new brand
      }
    } catch (error) {
      console.error("Error adding new Brand:", error);
      alert("Failed to add new Brand.");
    }
  };

  const handleAddNewProduct = async () => {
    if (newProductName.trim() === "") {
      alert("Product name cannot be empty.");
      return;
    }

    if (!selectedBrand) {
      alert("Please select a Brand before adding a Product.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newProductName);
      formData.append("brandId", selectedBrand);
      if (newProductImage) {
        formData.append("image", newProductImage);
      }

      const response = await apiClient.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newProduct = response.data?.data;
      if (newProduct) {
        setSelectedProduct(newProduct._id);
        setIsAddingNewProduct(false);
        setNewProductName("");
        setNewProductImage(null);
        console.log("Added new Product:", newProduct);
        // Optionally, refresh products list or append the new product
      }
    } catch (error) {
      console.error("Error adding new Product:", error);
      alert("Failed to add new Product.");
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle adding new entries first
    if (isAddingNewFirm) {
      await handleAddNewFirm();
    }

    if (isAddingNewCategory) {
      await handleAddNewCategory();
    }

    if (isAddingNewBrand) {
      await handleAddNewBrand();
    }

    if (isAddingNewProduct) {
      await handleAddNewProduct();
    }

    // Now, handle saving the purchase
    const purchaseData = {
      firmId: selectedFirm,
      categoryId: selectedCategory,
      brandId: selectedBrand,
      productId: selectedProduct,
      quantity: Number(editingPurchase?.quantity) || 0,
      price: Number(editingPurchase?.price) || 0,
      amount:
        (Number(editingPurchase?.quantity) || 0) *
        (Number(editingPurchase?.price) || 0),
      notes: editingPurchase?.notes || "",
      purchasedById:
        currentUserRole === "user"
          ? currentUserId
          : editingPurchase?.purchasedById,
      date: editingPurchase?.date || new Date().toISOString(),
    };

    console.log("Submitting Purchase Data:", purchaseData);

    handleSavePurchase(purchaseData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-full p-8 overflow-y-auto bg-white rounded shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">
          {editingPurchase ? "Edit Purchase" : "Add New Purchase"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Firm Dropdown */}
          <DropdownWithAddNew
            label="Firm"
            options={firms}
            value={selectedFirm ?? ""}
            onChange={(value) => {
              setSelectedFirm(value || null);
              setSelectedCategory(null);
              setSelectedBrand(null);
              setSelectedProduct(null);
              console.log("Selected Firm:", value);
            }}
            isAddingNew={isAddingNewFirm}
            setIsAddingNew={setIsAddingNewFirm}
            newEntryName={newFirmName}
            setNewEntryName={setNewFirmName}
            onAddNew={handleAddNewFirm}
          />

          {/* Category Dropdown */}
          <DropdownWithAddNew
            label="Category"
            options={filteredCategories}
            value={selectedCategory ?? ""}
            onChange={(value) => {
              setSelectedCategory(value || null);
              setSelectedBrand(null);
              setSelectedProduct(null);
              console.log("Selected Category:", value);
            }}
            isAddingNew={isAddingNewCategory}
            setIsAddingNew={setIsAddingNewCategory}
            newEntryName={newCategoryName}
            setNewEntryName={setNewCategoryName}
            onAddNew={handleAddNewCategory}
          />

          {/* Brand Dropdown */}
          <DropdownWithAddNew
            label="Brand"
            options={filteredBrands}
            value={selectedBrand ?? ""}
            onChange={(value) => {
              setSelectedBrand(value || null);
              setSelectedProduct(null);
              console.log("Selected Brand:", value);
            }}
            isAddingNew={isAddingNewBrand}
            setIsAddingNew={setIsAddingNewBrand}
            newEntryName={newBrandName}
            setNewEntryName={setNewBrandName}
            onAddNew={handleAddNewBrand}
          />

          {/* Product Dropdown */}
          <DropdownWithAddNew
            label="Product"
            options={filteredProducts}
            value={selectedProduct ?? ""}
            onChange={(value) => {
              setSelectedProduct(value || null);
              console.log("Selected Product:", value);
            }}
            isAddingNew={isAddingNewProduct}
            setIsAddingNew={setIsAddingNewProduct}
            newEntryName={newProductName}
            setNewEntryName={setNewProductName}
            onAddNew={handleAddNewProduct}
          />

          {/* Purchased By Dropdown */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Purchased By</label>
            <select
              value={
                currentUserRole === "user"
                  ? currentUserId
                  : editingPurchase?.purchasedById || ""
              }
              onChange={(e) => {
                const value = e.target.value;
                setEditingPurchase({
                  ...editingPurchase,
                  purchasedById: value,
                });
                console.log("Selected Purchased By:", value);
              }}
              className="w-full p-2 border rounded"
              disabled={currentUserRole === "user"}
              required
            >
              {currentUserRole !== "user" && (
                <option value="">Select User</option>
              )}
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.role || "user"})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Field */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={editingPurchase?.quantity || ""}
              onChange={(e) =>
                setEditingPurchase({
                  ...editingPurchase,
                  quantity: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>

          {/* Price Field */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={editingPurchase?.price || ""}
              onChange={(e) =>
                setEditingPurchase({
                  ...editingPurchase,
                  price: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Amount Field (Read-only) */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Amount</label>
            <input
              type="number"
              name="amount"
              value={
                (Number(editingPurchase?.quantity) || 0) *
                (Number(editingPurchase?.price) || 0)
              }
              readOnly
              className="w-full p-2 bg-gray-100 border rounded"
            />
          </div>

          {/* Notes Field */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Notes</label>
            <textarea
              name="notes"
              value={editingPurchase?.notes || ""}
              onChange={(e) =>
                setEditingPurchase({
                  ...editingPurchase,
                  notes: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>

          {/* Purchase Summary */}
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-bold">Purchase Summary</h3>
            <p>Total Products Purchased from Firm: {totalProductsPurchased}</p>
            <p>Total Amount Paid to Firm: ${totalAmountPaid.toFixed(2)}</p>
          </div>

          {/* Modal Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// PropTypes for type checking
PurchaseForm.propTypes = {
  categories: PropTypes.array.isRequired,
  firms: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  editingPurchase: PropTypes.object,
  setEditingPurchase: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSavePurchase: PropTypes.func.isRequired,
  currentUserRole: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
};
