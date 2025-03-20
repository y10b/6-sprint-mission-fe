import React from "react";
import "./css/Pagination.css";

const Pagination = ({ page, setPage, hasNext, totalPages }) => {
  const getPageNumbers = () => {
    const range = 2; // Number of pages to show before and after the current page
    const startPage = Math.max(1, page - range); // Calculate start page
    const endPage = Math.min(totalPages, page + range); // Calculate end page

    let pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="paginationContainer">
      {/* Previous button */}
      <button
        className="beforeBtn"
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
      >
        &lt;
      </button>

      {/* Page number buttons */}
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => setPage(pageNum)}
          className={pageNum === page ? "active" : ""}
        >
          {pageNum}
        </button>
      ))}

      {/* Next button */}
      <button onClick={() => setPage(page + 1)} disabled={!hasNext}>
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
