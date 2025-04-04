import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEdit, FaTrashAlt, FaPlusCircle, FaSearch } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import apiClient from "../services/apiClient";
import defaultUser from "../assets/default-profile.png";

export default function BrandsList() {
  // ----------------------------------------------------------------
  // 1) USER ROLE + COLOR CODING
  // ----------------------------------------------------------------
  const { userInfo } = useSelector((state) => state.auth);
  const userRole = userInfo?.role || "user"; // fallback to user if not set

  // Mapping role -> color for the header
  const roleColors = {
    admin: "bg-red-500",
    staff: "bg-yellow-500",
    user: "bg-green-500",
  };

  // ----------------------------------------------------------------
  // STATE
  // ----------------------------------------------------------------
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states for add/edit
  const [editingBrand, setEditingBrand] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);

  // Details Modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsBrand, setDetailsBrand] = useState(null);

  // Delete Confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBrandForDelete, setSelectedBrandForDelete] = useState(null);

  // Mobile search
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const navigate = useNavigate();

  // ----------------------------------------------------------------
  // FETCH BRANDS
  // ----------------------------------------------------------------
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await apiClient.get("/brands?limit=100&page=1");
        console.log("Fetched brands from API:", response.data.data);
        setBrands(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Error fetching brands");
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // ----------------------------------------------------------------
  // FILTER + PAGINATION
  // ----------------------------------------------------------------
  const filteredBrands = brands.filter((brand) =>
    brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBrand = currentPage * itemsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - itemsPerPage;
  const currentBrands = filteredBrands.slice(
    indexOfFirstBrand,
    indexOfLastBrand
  );
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ----------------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------------
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  // ----------------------------------------------------------------
  // DETAILS MODAL
  // ----------------------------------------------------------------
  const openDetailsModal = (brand) => {
    setDetailsBrand(brand);
    setDetailsModalOpen(true);
  };
  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setDetailsBrand(null);
  };

  // ----------------------------------------------------------------
  // DELETE CONFIRMATION
  // ----------------------------------------------------------------
  const confirmDeleteBrand = (brand) => {
    setSelectedBrandForDelete(brand);
    setConfirmOpen(true);
  };
  const refetchBrands = async () => {
    try {
      const response = await apiClient.get("/brands?limit=100&page=1");
      setBrands(response.data.data);
    } catch (err) {
      console.error("Error refetching brands:", err);
      setError("Failed to refresh brand list.");
    }
  };

  const deleteBrand = async () => {
    try {
      if (!selectedBrandForDelete?._id) return;
      const brandId = selectedBrandForDelete._id;

      // Optimistic UI update
      setBrands((prev) => prev.filter((b) => b._id !== brandId));

      // Actual API call
      await apiClient.delete(`/brands/${brandId}`);
      setConfirmOpen(false);
    } catch (err) {
      console.error("Error deleting brand:", err);
      alert("Failed to delete brand. Reverting changes.");
      // Revert UI
      await refetchBrands();
    }
  };

  // ----------------------------------------------------------------
  // ADD/EDIT MODALS
  // ----------------------------------------------------------------
  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setIsAddingNewBrand(false);
    setModalOpen(true);
  };
  const openAddNewModal = () => {
    setEditingBrand({ name: "", image: "", description: "" });
    setIsAddingNewBrand(true);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditingBrand(null);
  };

  // ----------------------------------------------------------------
  // SAVE HANDLER (CREATE OR UPDATE)
  // ----------------------------------------------------------------
  const extractUpdatedBrand = (response, key) => {
    try {
      const data = response?.data;
      if (!data) return null;
      console.log("Server response data:", data);

      if (key === "new" && data.new) {
        return data.new;
      }
      if (key === "updated" && data.updated) {
        return data.updated;
      }

      // If your server returns something else, adapt here
      const brand = data[key];
      return brand && brand._id ? brand : null;
    } catch (err) {
      console.error("Error extracting updated brand:", err);
      return null;
    }
  };

  const saveBrandDetails = async () => {
    console.log("Saving brand details:", editingBrand);
    try {
      if (!editingBrand) return;

      if (isAddingNewBrand) {
        // CREATE
        const tempId = `temp-${Date.now()}`;
        const tempBrand = { ...editingBrand, _id: tempId };

        // Optimistic local update
        setBrands((prev) => [...prev, tempBrand]);

        // Actual API call
        const response = await apiClient.post("/brands", editingBrand);
        console.log("POST response:", response.data);

        const newBrand = extractUpdatedBrand(response, "new");
        if (!newBrand) {
          await refetchBrands();
        } else {
          // Replace temp brand with final brand from server
          setBrands((prev) =>
            prev.map((b) => (b._id === tempId ? newBrand : b))
          );
        }
      } else {
        // UPDATE
        // 1) Optimistic local update
        setBrands((prev) =>
          prev.map((b) =>
            b._id === editingBrand._id ? { ...b, ...editingBrand } : b
          )
        );

        // 2) Actual API call
        const response = await apiClient.put(
          `/brands/${editingBrand._id}`,
          editingBrand
        );
        console.log("PUT response:", response.data);

        // 3) Extract the updated brand from server
        const updatedBrand = extractUpdatedBrand(response, "updated");
        if (!updatedBrand) {
          console.error("Failed to extract updated brand, re-fetching...");
          await refetchBrands();
        } else {
          // 4) Use the EXACT brand from the server
          setBrands((prev) =>
            prev.map((b) => (b._id === editingBrand._id ? updatedBrand : b))
          );

          // If the brand is open in the details modal, update it
          if (detailsBrand && detailsBrand._id === editingBrand._id) {
            setDetailsBrand(updatedBrand);
          }
        }
      }

      setSearchTerm("");
      closeModal();
    } catch (err) {
      // === Only show "Critical error" if it's NOT a 401. ===
      if (err.response?.status === 401) {
        // Our Axios interceptor will handle logout/alert/redirect
        return;
      }

      console.error("Critical error in saveBrandDetails:", err);
      alert("A critical error occurred. Please try again.");
      await refetchBrands();
    }
  };

  // ----------------------------------------------------------------
  // INPUT CHANGE
  // ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Input change:", name, value);
    setEditingBrand((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----------------------------------------------------------------
  // CONDITIONAL RENDER
  // ----------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading brands...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // RETURN JSX
  // ----------------------------------------------------------------
  return (
    <>
      {/* Sticky Header */}
      <header className={`sticky top-0 z-10 shadow-md ${roleColors[userRole]}`}>
        <div className="flex items-center justify-between px-4 py-4 text-white">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold">
              Brands ({filteredBrands.length})
            </h1>
            <span className="px-2 py-1 text-sm font-medium text-black bg-white rounded">
              {userRole.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hidden w-full px-4 py-2 text-black border rounded-lg md:block focus:ring focus:ring-indigo-200"
            />
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white md:hidden"
            >
              <FaSearch size={24} />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={navigateToDashboard}
              className="flex items-center px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              ➤ Dashboard
            </button>
            {(userRole === "staff" || userRole === "admin") && (
              <>
                <button
                  onClick={openAddNewModal}
                  className="items-center hidden px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 md:flex"
                >
                  <FaPlusCircle className="inline-block mr-2" /> Add New Brand
                </button>
                <button
                  onClick={openAddNewModal}
                  className="text-white md:hidden"
                >
                  <FaPlusCircle size={24} />
                </button>
              </>
            )}
          </div>
        </div>
        {isSearchOpen && (
          <div className="px-4 pb-2 md:hidden">
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 text-black border rounded-lg focus:ring focus:ring-indigo-200"
            />
          </div>
        )}
      </header>

      {/* Brand Grid */}
      <main className="p-4 pb-20">
        {filteredBrands.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentBrands.map((brand) => {
              if (!brand?._id) {
                console.error("Skipping invalid brand:", brand);
                return null;
              }
              return (
                <div
                  key={brand._id}
                  className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-2xl"
                >
                  {/* Clickable Area */}
                  <div
                    className="cursor-pointer"
                    onClick={() => openDetailsModal(brand)}
                  >
                    <div className="flex items-center justify-center h-48 bg-gray-100">
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="object-contain w-32 h-32 mx-auto"
                        onError={(e) => {
                          e.currentTarget.src = defaultUser;
                        }}
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {brand.name}
                      </h3>
                      {/* {brand.description ? (
                        <p className="mt-2 text-sm text-gray-600">
                          {brand.description}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm italic text-gray-400">
                          No description provided.
                        </p>
                      )} */}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-around p-4 border-t">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailsModal(brand);
                      }}
                      className="text-sm font-medium text-blue-600 hover:underline focus:outline-none"
                    >
                      Details
                    </button>
                    {(userRole === "staff" || userRole === "admin") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(brand);
                        }}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                    )}
                    {userRole === "admin" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteBrand(brand);
                        }}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <FaTrashAlt className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 text-center text-gray-600">
            No brands found for your search.
          </p>
        )}
      </main>

      {/* Pagination */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between px-4 py-2"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstBrand + 1}</span> to{" "}
              <span className="font-medium">
                {indexOfLastBrand > filteredBrands.length
                  ? filteredBrands.length
                  : indexOfLastBrand}
              </span>{" "}
              of <span className="font-medium">{filteredBrands.length}</span>{" "}
              results
            </p>
          </div>
          <div className="flex justify-between flex-1 sm:justify-end">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </nav>
      </footer>

      {/* MODAL for Add/Edit Brand */}
      <Transition appear show={modalOpen} as="div">
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {editingBrand && (
                <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
                  <Dialog.Title className="text-2xl font-bold leading-6 text-gray-900">
                    {isAddingNewBrand ? "Add New Brand" : "Edit Brand"}
                  </Dialog.Title>
                  <div className="mt-4">
                    {/* Logo */}
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-semibold">
                        Logo
                      </label>
                      <div className="flex items-center justify-center mb-4">
                        <img
                          src={editingBrand?.image || defaultUser}
                          alt={editingBrand?.name || "Default Logo"}
                          className="object-contain w-24 h-24"
                          onError={(e) => {
                            e.currentTarget.src = defaultUser;
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        name="image"
                        value={editingBrand?.image || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                        placeholder="Enter logo URL"
                      />
                    </div>
                    {/* Name */}
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-semibold">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editingBrand?.name || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                        placeholder="Enter brand name"
                      />
                    </div>
                    {/* Description */}
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-semibold">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editingBrand?.description || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                        placeholder="Enter brand description"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 space-x-4">
                    <button
                      onClick={saveBrandDetails}
                      className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* DETAILS MODAL */}
      <Transition appear show={detailsModalOpen} as="div">
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeDetailsModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {detailsBrand && (
                <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
                  <Dialog.Title className="text-2xl font-bold leading-6 text-gray-900">
                    Brand Details
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={detailsBrand.image}
                        alt={detailsBrand.name}
                        className="object-contain w-32 h-32"
                        onError={(e) => {
                          e.currentTarget.src = defaultUser;
                        }}
                      />
                    </div>
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {detailsBrand.name}
                    </p>
                    {detailsBrand.description ? (
                      <p>
                        <span className="font-semibold">Description:</span>{" "}
                        {detailsBrand.description}
                      </p>
                    ) : (
                      <p>
                        <span className="font-semibold">Description:</span> No
                        description provided.
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={closeDetailsModal}
                      className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* CONFIRM DELETE MODAL */}
      <Transition appear show={confirmOpen} as="div">
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setConfirmOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {selectedBrandForDelete && (
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
                  <Dialog.Title className="text-2xl font-bold leading-6 text-gray-900">
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-gray-600">
                      Are you sure you want to delete this brand? This action
                      cannot be undone.
                    </p>
                  </div>
                  <div className="flex justify-end mt-6 space-x-4">
                    <button
                      onClick={() => setConfirmOpen(false)}
                      className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={deleteBrand}
                      className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
