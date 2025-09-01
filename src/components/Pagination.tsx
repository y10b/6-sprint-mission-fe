"use client";

import React, { memo, useCallback, useMemo } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { IPaginationProps } from "@/types";

/**
 * 최적화된 페이지 버튼 컴포넌트
 * React.memo로 개별 버튼 최적화
 */
const PageButton = memo(
  ({
    pageNum,
    currentPage,
    onClick,
    className,
  }: {
    pageNum: number;
    currentPage: number;
    onClick: (page: number) => void;
    className: string;
  }) => {
    const handleClick = useCallback(() => {
      onClick(pageNum);
    }, [pageNum, onClick]);

    const buttonClassName = useMemo(() => {
      const isActive = pageNum === currentPage;
      return `${className} cursor-pointer ${
        isActive
          ? "bg-blue-500 text-white"
          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
      } transition-colors duration-200`;
    }, [pageNum, currentPage, className]);

    return (
      <button
        onClick={handleClick}
        className={buttonClassName}
        aria-label={`페이지 ${pageNum}로 이동`}
        aria-current={pageNum === currentPage ? "page" : undefined}
      >
        {pageNum}
      </button>
    );
  }
);

PageButton.displayName = "PageButton";

/**
 * 최적화된 네비게이션 버튼 컴포넌트
 */
const NavButton = memo(
  ({
    onClick,
    disabled,
    className,
    children,
    ariaLabel,
  }: {
    onClick: () => void;
    disabled: boolean;
    className: string;
    children: React.ReactNode;
    ariaLabel: string;
  }) => {
    const buttonClassName = useMemo(
      () =>
        `${className} text-gray-500 bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 disabled:hover:bg-gray-50 transition-colors duration-200`,
      [className]
    );

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={buttonClassName}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }
);

NavButton.displayName = "NavButton";

/**
 * 최적화된 페이지네이션 컴포넌트
 */
const Pagination = memo(
  ({ page, setPage, hasNext, totalPages }: IPaginationProps) => {
    const range = 2;

    // 페이지 번호 배열을 useMemo로 메모이제이션
    const pageNumbers = useMemo(() => {
      const start = Math.max(1, page - range);
      const end = Math.min(totalPages, page + range);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [page, totalPages, range]);

    // 페이지 변경 핸들러를 useCallback으로 메모이제이션
    const handlePageChange = useCallback(
      (newPage: number) => {
        if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
          setPage(newPage);
        }
      },
      [page, totalPages, setPage]
    );

    // 이전/다음 페이지 핸들러들
    const handlePrevPage = useCallback(() => {
      handlePageChange(page - 1);
    }, [handlePageChange, page]);

    const handleNextPage = useCallback(() => {
      handlePageChange(page + 1);
    }, [handlePageChange, page]);

    // 공통 버튼 클래스명 메모이제이션
    const buttonClassName = useMemo(
      () =>
        "w-10 h-10 rounded-full border border-gray-300 text-base font-semibold flex items-center justify-center",
      []
    );

    // 페이지네이션이 필요하지 않은 경우 렌더링하지 않음
    if (totalPages <= 1) {
      return null;
    }

    return (
      <nav
        className="flex justify-center items-center gap-1 mt-10"
        aria-label="페이지네이션"
        role="navigation"
      >
        {/* 이전 버튼 */}
        <NavButton
          onClick={handlePrevPage}
          disabled={page <= 1}
          className={buttonClassName}
          ariaLabel="이전 페이지"
        >
          <MdArrowBackIosNew />
        </NavButton>

        {/* 페이지 번호들 */}
        {pageNumbers.map((pageNum) => (
          <PageButton
            key={pageNum}
            pageNum={pageNum}
            currentPage={page}
            onClick={handlePageChange}
            className={buttonClassName}
          />
        ))}

        {/* 다음 버튼 */}
        <NavButton
          onClick={handleNextPage}
          disabled={!hasNext || page >= totalPages}
          className={buttonClassName}
          ariaLabel="다음 페이지"
        >
          <MdArrowForwardIos />
        </NavButton>
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;
