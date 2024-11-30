// Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400 transition disabled:opacity-50"
      >
        Trước
      </button>
      <span>
        Trang {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400 transition disabled:opacity-50"
      >
        Sau
      </button>
    </div>
  );
};

export default Pagination;
