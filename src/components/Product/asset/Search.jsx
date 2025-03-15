import React from "react";
import { FaSearch } from "react-icons/fa"; // react-icons에서 FaSearch 아이콘 임포트
import "./css/Search.css";

const Search = ({ keyword, setKeyword }) => {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <input
        className="searchInput"
        type="text"
        placeholder="검색할 상품을 입력해주세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <FaSearch className="searchIcon" />
    </div>
  );
};

export default Search;
