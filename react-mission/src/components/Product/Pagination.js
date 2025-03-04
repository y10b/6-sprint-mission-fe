import React from "react";

const Pagination = ({ page, setPage, hasNext, totalPages }) => {
  // 페이지 번호 범위 계산 (현재 페이지를 기준으로 5개 버튼)
  const getPageNumbers = () => {
    const startPage = Math.max(1, page); // 시작 페이지 (현재 페이지로 시작)
    const endPage = Math.min(totalPages, page + 4); // 끝 페이지 (현재 페이지에서 +4까지)

    let pageNumbers = [];
    for (let i = startPage + 1; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="pagination-container">
      {/* 이전 버튼 */}
      <button
        className="before-Btn"
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
      >
        &lt;
      </button>

      {/* 현재 페이지 표시 */}
      <button className="current-page" disabled>
        {page}
      </button>

      {/* 나머지 페이지 번호 버튼들 */}
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => setPage(pageNum)}
          className={pageNum === page ? "active" : ""}
        >
          {pageNum}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
