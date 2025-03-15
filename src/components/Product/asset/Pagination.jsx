import React from "react";
import "./css/Pagination.css";

const Pagination = ({ page, setPage, hasNext, totalPages }) => {
  // 페이지 번호 범위 계산 (현재 페이지를 기준으로 앞뒤 2개씩 총 5개 버튼)
  const getPageNumbers = () => {
    const range = 2; // 앞뒤로 표시할 페이지 수
    const startPage = Math.max(1, page - range); // 시작 페이지 (현재 페이지 기준으로 앞쪽 2개까지)
    const endPage = Math.min(totalPages, page + range); // 끝 페이지 (현재 페이지 기준으로 뒤쪽 2개까지)

    let pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="paginationContainer">
      {/* 이전 버튼 */}
      <button
        className="beforeBtn"
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        style={{
          backgroundColor: page <= 1 ? "var(--colorBtn)" : "transparent",
        }} // 비활성화 상태에서만 배경색 적용
      >
        &lt;
      </button>

      {/* 페이지 번호 버튼들 */}
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => setPage(pageNum)}
          className={pageNum === page ? "active" : ""}
          style={{
            backgroundColor:
              pageNum === page ? "var(--colorBtn)" : "transparent", // 현재 페이지에만 배경색 적용
          }}
        >
          {pageNum}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
        style={{
          backgroundColor:
            page >= totalPages ? "var(--colorBtn)" : "transparent",
        }} // 비활성화 상태에서만 배경색 적용
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
