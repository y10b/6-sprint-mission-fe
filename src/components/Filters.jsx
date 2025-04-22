"use client";
import React from "react";
import styles from "./css/filters.module.css"; // CSS 모듈 import

const Filters = ({ orderBy, setOrderBy }) => {
  // Function to handle select change
  const handleSelectChange = (e) => {
    setOrderBy(e.target.value); // Update the orderBy state
  };

  return (
    <div>
      <div>
        <select
          className={styles.filtersSelect} // CSS 모듈을 사용한 클래스 적용
          value={orderBy}
          onChange={handleSelectChange} // Correct onChange handler
        >
          <option value="recent">최신 순</option>
          <option value="favorite">좋아요 순</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
