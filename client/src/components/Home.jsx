// src/components/Home.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold">
        Welcome to the Product Dashboard
      </h1>
      <p className="mb-8 text-lg">Manage your products efficiently.</p>
      <button
        onClick={handleNavigate}
        className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        View Products
      </button>
    </div>
  );
};

export default Home;
