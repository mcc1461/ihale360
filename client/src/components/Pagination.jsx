import React from "react";

const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <div className="sticky bottom-0 left-0 w-full py-4 bg-white border-t">
      <nav className="flex items-center justify-between px-4 sm:px-6">
        <p className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={onPrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-gray-300 hover:bg-gray-50 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>
          <button
            onClick={onNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-gray-300 hover:bg-gray-50 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Pagination;
