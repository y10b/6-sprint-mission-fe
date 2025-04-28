"use client";

import React from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const Pagination = ({ page, setPage, hasNext, totalPages }) => {
  const getPageNumbers = () => {
    const range = 2;
    const startPage = Math.max(1, page - range);
    const endPage = Math.min(totalPages, page + range);

    let pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  const handlePageChange = (newPage) => {
    console.log("Page changed to:", newPage); // 페이지 변경 로그
    setPage(newPage); // 페이지 변경
  };

  return (
    <div className="flex justify-center items-center gap-1 mt-10">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className="cursor-pointer w-10 h-10 rounded-full border border-gray-300 text-gray-500 font-semibold text-base bg-gray-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MdArrowBackIosNew />
      </button>

      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => setPage(pageNum)}
          className={` cursor-pointer w-10 h-10 rounded-full border border-gray-300 text-base font-semibold flex items-center justify-center ${
            pageNum === page
              ? "bg-blue-500 text-gray-50"
              : "bg-gray-50 text-gray-500"
          }`}
        >
          {pageNum}
        </button>
      ))}

      <button
        onClick={() => setPage(page + 1)}
        disabled={!hasNext}
        className="cursor-pointer w-10 h-10 rounded-full border border-gray-300 text-gray-500 font-semibold text-base bg-gray-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MdArrowForwardIos />
      </button>
    </div>
  );
};

export default Pagination;
