"use client";

import React from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./css/search.module.css";

/**
 * @param {string} keyword - 현재 입력 값
 * @param {function} setKeyword - 입력값 변경 핸들러
 * @param {string} variant - 스타일 버전 (예: 'default', 'compact')
 */
const Search = ({ keyword, setKeyword, variant = "long" }) => {
  const handleInputChange = (e) => {
    if (setKeyword) {
      setKeyword(e.target.value);
    } else {
      console.error("setKeyword 함수가 전달되지 않았습니다.");
    }
  };

  const inputClass =
    variant === "short" ? styles.searchInput_short : styles.searchInput_long;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <input
        className={inputClass}
        type="text"
        placeholder="검색할 상품을 입력해주세요"
        value={keyword}
        onChange={handleInputChange}
      />
      <FaSearch className={styles.searchIcon} />
    </div>
  );
};

export default Search;
