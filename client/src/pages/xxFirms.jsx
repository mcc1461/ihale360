// src/utils/Firms.jsx

import React, { useEffect, useState, useCallback } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaSearch,
  FaHome,
} from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce"; // Doğru import

export default function Firms() {
  const navigate = useNavigate();
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingFirm, setEditingFirm] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddingNewFirm, setIsAddingNewFirm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedFirmForDelete, setSelectedFirmForDelete] = useState(null);
  const [expandedFirms, setExpandedFirms] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Default değer
  const [cardsPerRow, setCardsPerRow] = useState(3); // Default değer

  // Debounce Search - useCallback ile memoize ediyoruz
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1); // Arama yaptığınızda sayfayı başa alabilirsiniz
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  // Calculate itemsPerPage based on window size
  const calculateItemsPerPage = () => {
    const containerWidth = window.innerWidth - 64; // Gerekirse ayarlayın
    const containerHeight = window.innerHeight - 200; // Gerekirse ayarlayın

    const calculatedCardsPerRow = Math.floor(containerWidth / 300) || 1; // CARD_WIDTH = 300
    const rowsPerPage = Math.floor(containerHeight / 400) || 1; // CARD_HEIGHT = 400

    setCardsPerRow(calculatedCardsPerRow);
    setItemsPerPage(calculatedCardsPerRow * rowsPerPage);
  };

  // Function to fetch firms data
  const fetchFirms = async () => {
    try {
      const response = await apiClient.get("/firms");
      setFirms(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching firms:", error);

      // Detailed error logging
      if (error.response) {
        // The request was made, and the server responded with a status code outside 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        setError(error.response.data?.message || "Error fetching firms");
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("No response received:", error.request);
        setError("No response received from the server.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
        setError("Error setting up the request.");
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirms();
    calculateItemsPerPage();

    // Debounce resize
    const debouncedHandleResize = debounce(() => {
      calculateItemsPerPage();
    }, 300);

    window.addEventListener("resize", debouncedHandleResize);

    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, []);

  const confirmDeleteFirm = (firm) => {
    setSelectedFirmForDelete(firm);
    setConfirmOpen(true);
  };

  const deleteFirm = async () => {
    try {
      await apiClient.delete(`/firms/${selectedFirmForDelete._id}`);
      setFirms((prevFirms) =>
        prevFirms.filter((firm) => firm._id !== selectedFirmForDelete._id)
      );
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting the firm:", error);
      setError(error.response?.data?.message || "Error deleting the firm");
    }
  };

  const openEditModal = (firm) => {
    setEditingFirm(firm);
    setIsAddingNewFirm(false);
    setModalOpen(true);
    setFormError(null);
  };

  const openAddNewModal = () => {
    setEditingFirm({ name: "", image: "", phone: "", address: "" });
    setIsAddingNewFirm(true);
    setModalOpen(true);
    setFormError(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingFirm(null);
    setFormError(null);
  };

  const saveFirmDetails = async () => {
    try {
      if (!editingFirm.name || !editingFirm.image) {
        setFormError("Firm name and image are required.");
        return;
      }

      if (isAddingNewFirm) {
        const response = await apiClient.post("/firms", editingFirm);
        setFirms([...firms, response.data.data]);
      } else {
        const updateResponse = await apiClient.put(
          `/firms/${editingFirm._id}`,
          editingFirm
        );

        if (updateResponse.status === 200 || updateResponse.status === 202) {
          setFirms((prevFirms) =>
            prevFirms.map((firm) =>
              firm._id === editingFirm._id ? { ...editingFirm } : firm
            )
          );
        } else {
          throw new Error("Failed to update the firm.");
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error saving the firm:", error);
      setFormError(
        error.response?.data?.message ||
          "Error saving the firm. Please try again."
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingFirm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDetails = (id) => {
    setExpandedFirms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const hideDetails = (id) => {
    setExpandedFirms((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const filteredFirms = firms.filter((firm) =>
    firm?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastFirm = currentPage * itemsPerPage;
  const indexOfFirstFirm = indexOfLastFirm - itemsPerPage;
  const currentFirms = filteredFirms.slice(indexOfFirstFirm, indexOfLastFirm);
  const totalPages = Math.ceil(filteredFirms.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (loading) {
    return <p>Loading firms...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <div className="sticky top-0 z-10 bg-blue-500 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 text-white">
          <h1 className="text-3xl font-bold">Firms ({filteredFirms.length})</h1>
          <button
            className="text-white hover:text-gray-200"
            onClick={() => navigate("/dashboard")}
          >
            <FaHome size={28} />
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-blue-500">
          <div className="flex items-center space-x-4">
            {/* Search Input for Desktop */}
            <input
              type="text"
              placeholder="Search firms..."
              onChange={handleSearchChange}
              className="hidden w-full px-4 py-2 border rounded-lg md:block focus:ring focus:ring-indigo-200"
            />

            {/* Search Icon for Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white md:hidden"
            >
              <FaSearch size={24} />
            </button>

            {/* Search Input for Mobile */}
            {isSearchOpen && (
              <input
                type="text"
                placeholder="Search firms..."
                onChange={handleSearchChange}
                className="block w-full px-4 py-2 border rounded-lg md:hidden focus:ring focus:ring-indigo-200"
              />
            )}
          </div>

          {/* Add New Firm Button for Desktop */}
          <button
            onClick={openAddNewModal}
            className="items-center hidden px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 md:flex"
          >
            <FaPlusCircle className="inline-block mr-2" /> Add New Firm
          </button>

          {/* Add New Firm Icon for Mobile */}
          <button onClick={openAddNewModal} className="text-white md:hidden">
            <FaPlusCircle size={24} />
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        {currentFirms.length > 0 ? (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${cardsPerRow}, minmax(0, 1fr))`,
            }}
          >
            {currentFirms.map((firm) => (
              <div
                key={firm._id}
                className="overflow-hidden transition-transform duration-300 transform bg-gray-100 rounded-lg shadow-lg cursor-pointer hover:scale-105"
                onMouseLeave={() => hideDetails(firm._id)}
              >
                <div className="flex items-center justify-center h-56 bg-white">
                  <img
                    src={firm.image}
                    alt={firm.name}
                    className="object-contain w-full h-full p-4"
                  />
                </div>
                <div className="p-6 text-center">
                  <button
                    onClick={() => toggleDetails(firm._id)}
                    className="font-semibold text-indigo-500 hover:text-indigo-600"
                  >
                    {expandedFirms[firm._id] ? "Hide Details" : "View Details"}
                  </button>

                  {expandedFirms[firm._id] && (
                    <div className="mt-4">
                      <h3 className="text-2xl font-semibold text-gray-800">
                        {firm.name}
                      </h3>
                      <p className="text-gray-600">{firm.address}</p>
                      <p className="mt-4 font-medium text-gray-500">
                        Phone: {firm.phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center p-4">
                  <button
                    className="mr-3 text-blue-500 hover:text-blue-700"
                    onClick={() => openEditModal(firm)}
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => confirmDeleteFirm(firm)}
                  >
                    <FaTrashAlt className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No firms found for your search.
          </p>
        )}
      </div>

      <div className="sticky bottom-0 left-0 w-full py-4 bg-white border-t">
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between px-4 sm:px-6"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstFirm + 1}</span> to{" "}
              <span className="font-medium">
                {indexOfLastFirm > filteredFirms.length
                  ? filteredFirms.length
                  : indexOfLastFirm}
              </span>{" "}
              of <span className="font-medium">{filteredFirms.length}</span>{" "}
              results
            </p>
          </div>
          <div className="flex justify-between flex-1 sm:justify-end">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </nav>
      </div>

      {/* Edit/Add Firm Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-2xl font-bold">
              {isAddingNewFirm ? "Add New Firm" : "Edit Firm"}
            </h2>

            {formError && <p className="mb-4 text-red-500">{formError}</p>}

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Logo</label>
              <div className="flex items-center justify-center mb-4">
                <img
                  src={editingFirm?.image}
                  alt={editingFirm?.name}
                  className="object-contain w-full h-32"
                />
              </div>
              <input
                type="text"
                name="image"
                value={editingFirm?.image || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
                placeholder="Enter logo URL"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={editingFirm?.name || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Phone</label>
              <input
                type="text"
                name="phone"
                value={editingFirm?.phone || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={editingFirm?.address || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={saveFirmDetails}
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
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <Transition show={confirmOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setConfirmOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                Confirm Deletion
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-gray-600">
                Are you sure you want to delete this firm? This action cannot be
                undone.
              </Dialog.Description>

              <div className="flex justify-end mt-4 space-x-4">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteFirm}
                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
