"use client";

import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  hasNext: boolean;
  totalPages: number;
}

export default function Pagination({
  page,
  setPage,
  hasNext,
  totalPages,
}: PaginationProps) {
  const range = 2;

  const getPageNumbers = () => {
    const start = Math.max(1, page - range);
    const end = Math.min(totalPages, page + range);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const buttonClass =
    "w-10 h-10 rounded-full border border-gray-300 text-base font-semibold flex items-center justify-center";
  const disabledClass = "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex justify-center items-center gap-1 mt-10">
      {/* 이전 버튼 */}
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
        className={`${buttonClass} text-gray-500 bg-gray-50 cursor-pointer ${disabledClass}`}
      >
        <MdArrowBackIosNew />
      </button>

      {/* 페이지 번호 */}
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          className={`${buttonClass} cursor-pointer ${
            pageNum === page
              ? "bg-blue-500 text-white"
              : "bg-gray-50 text-gray-500"
          }`}
        >
          {pageNum}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasNext}
        className={`${buttonClass} text-gray-500 bg-gray-50 cursor-pointer ${disabledClass}`}
      >
        <MdArrowForwardIos />
      </button>
    </div>
  );
}
