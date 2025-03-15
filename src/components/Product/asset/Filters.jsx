import React from "react";
import "./css/Filters.css";

const Filters = ({ orderBy, setOrderBy }) => {
  return (
    <div>
      <div>
        <select
          className="filtersSelect"
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
