import React from "react";
import { FaSearch } from "react-icons/fa"; // react-icons에서 FaSearch 아이콘 임포트

const Search = ({ keyword, setKeyword }) => {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <input
        className="Search-input"
        type="text"
        placeholder="검색할 상품을 입력해주세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <FaSearch className="Search-icon" />
    </div>
  );
};

export default Search;
