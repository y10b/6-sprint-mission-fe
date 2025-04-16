"use client"; // 클라이언트 측에서만 렌더링

import React from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import styles from "./css/pagination.module.css";

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

  return (
    <div className={styles.paginationContainer}>
      {/* Previous button */}
      <button
        className={styles.beforeBtn}
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
      >
        <MdArrowBackIosNew />
      </button>

      {/* Page number buttons */}
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => setPage(pageNum)}
          className={pageNum === page ? styles.active : ""}
        >
          {pageNum}
        </button>
      ))}

      {/* Next button */}
      <button
        className={styles.nextBtn}
        onClick={() => setPage(page + 1)}
        disabled={!hasNext}
      >
        <MdArrowForwardIos />
      </button>
    </div>
  );
};

export default Pagination;
