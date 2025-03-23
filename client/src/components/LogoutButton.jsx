// src/components/LogoutButton.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logged out successfully.");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
