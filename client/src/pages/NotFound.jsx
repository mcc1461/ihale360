// src/pages/NotFound.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-4 text-6xl font-extrabold text-gray-800">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-gray-700">
        Page Not Found
      </h2>
      <p className="mb-6 text-center text-gray-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
