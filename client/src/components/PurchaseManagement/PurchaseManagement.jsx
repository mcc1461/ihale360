// PurchaseManagement.jsx
import React, { useEffect, useState } from "react";
import apiUserClient from "../../services/apiUserClient";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import PurchaseForm from "./PurchaseForm";
import PurchaseTable from "./PurchaseTable";
import ConfirmDialog from "./ConfirmDialog";
import apiClient from "../../services/apiClient";

export default function PurchaseManagement() {
  // State variables for data
  const [purchases, setPurchases] = useState([]);
  const [firms, setFirms] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // State variables for user information
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  // State variables for UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPurchaseForDelete, setSelectedPurchaseForDelete] =
    useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    const userId = localStorage.getItem("currentUserId") || "";
    setCurrentUserRole(role);
    setCurrentUserId(userId);

    const fetchData = async () => {
      try {
        const [
          purchasesResponse,
          firmsResponse,
          brandsResponse,
          categoriesResponse,
          productsResponse,
          usersResponse,
        ] = await Promise.all([
          apiClient.get("/purchases", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          apiClient.get("/firms"),
          apiClient.get("/brands"),
          apiClient.get("/categories"),
          apiClient.get("/products"),
          apiUserClient.get("/users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        console.log("Categories:", categoriesResponse.data?.data);
        console.log("Firms:", firmsResponse.data?.data);
        console.log("Brands:", brandsResponse.data?.data);
        console.log("Products:", productsResponse.data?.data);
        console.log("Users:", usersResponse.data?.data);

        setPurchases(purchasesResponse.data?.data || []);
        setFirms(firmsResponse.data?.data || []);
        setBrands(brandsResponse.data?.data || []);
        setCategories(categoriesResponse.data?.data || []);
        setProducts(productsResponse.data?.data || []);
        setUsers(usersResponse.data?.data || []);

        console.log("Data fetched successfully.");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSavePurchase = (purchaseData) => {
    if (editingPurchase) {
      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          purchase._id === editingPurchase._id
            ? { ...purchase, ...purchaseData }
            : purchase
        )
      );
    } else {
      setPurchases([
        ...purchases,
        { ...purchaseData, _id: Date.now().toString() },
      ]); // Assuming _id is generated
    }
    closeModal();
  };

  const openEditModal = (purchase) => {
    setEditingPurchase(purchase);
    setModalOpen(true);
  };

  const openAddNewModal = () => {
    setEditingPurchase(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPurchase(null);
  };

  const confirmDeletePurchase = (purchase) => {
    setSelectedPurchaseForDelete(purchase);
    setConfirmOpen(true);
  };

  const deletePurchase = async () => {
    try {
      await apiClient.delete(
        `/api/purchases/${selectedPurchaseForDelete._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPurchases(
        purchases.filter(
          (purchase) => purchase._id !== selectedPurchaseForDelete._id
        )
      );
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting the purchase:", error);
      setError("Error deleting the purchase");
    }
  };

  if (loading) return <p>Loading purchases...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Purchase Management</h1>
        <button
          onClick={openAddNewModal}
          className="flex items-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          <FaPlusCircle className="mr-2" /> Add New Purchase
        </button>
      </div>

      <PurchaseTable
        purchases={purchases}
        onEdit={openEditModal}
        onDelete={confirmDeletePurchase}
      />

      {modalOpen && (
        <PurchaseForm
          categories={categories}
          firms={firms}
          brands={brands}
          products={products}
          editingPurchase={editingPurchase}
          setEditingPurchase={setEditingPurchase}
          closeModal={closeModal}
          handleSavePurchase={handleSavePurchase}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
          users={users}
        />
      )}

      <ConfirmDialog
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        deleteProduct={deletePurchase}
      />
    </>
  );
}
