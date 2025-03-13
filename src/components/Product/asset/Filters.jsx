import React from "react";

const Filters = ({ orderBy, setOrderBy }) => {
  return (
    <div>
      {/* 정렬 기준을 선택할 수 있는 드롭다운 */}
      <div>
        <select
          className="filters-select"
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
        >
          <option value="recent">최신 순</option>
          <option value="favorite">좋아요 순</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
