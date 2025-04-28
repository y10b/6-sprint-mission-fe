"use client";

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

/**
 * @param {string} keyword - 현재 입력 값
 * @param {function} setKeyword - 입력값 변경 핸들러
 * @param {function} onSearch - 검색 실행 핸들러
 * @param {string} variant - 스타일 버전 (예: 'long', 'short')
 */
const Search = ({ keyword, setKeyword, onSearch, variant = "long" }) => {
  const [localKeyword, setLocalKeyword] = useState(keyword);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setKeyword(localKeyword);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [localKeyword]); // ✅ setKeyword는 의존성에 안 넣음

  const widthClasses = {
    long: "w-[288px] sm:w-[560px] md:w-[1054px]",
    short: "w-[288px] sm:w-[242px] md:w-[325px]",
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 폼 제출 방지
      onSearch(); // 검색 실행
    }
  };

  return (
    <div className="relative transition-all duration-300">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
      <input
        type="text"
        value={localKeyword}
        onChange={(e) => setLocalKeyword(e.target.value)}
        onKeyDown={handleKeyDown} // ✅ 여기만 있음
        placeholder="검색할 상품을 입력해주세요"
        className={`pl-12 pr-4 py-2 h-[44px] rounded-xl bg-gray-100 text-gray-600 placeholder-gray-400 text-sm md:text-base font-normal outline-none ${widthClasses[variant]} font-['Pretendard'] transition-all duration-300`}
      />
    </div>
  );
};

export default Search;
