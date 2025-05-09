"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

/**
 * @param {string} keyword - 현재 입력 값
 * @param {function} setKeyword - 입력값 변경 핸들러
 * @param {function} onSearch - 검색 실행 핸들러
 * @param {string} variant - 스타일 버전 (long, short)
 */
export default function Search({
  keyword,
  setKeyword,
  onSearch,
  variant = "long",
}) {
  const [localKeyword, setLocalKeyword] = useState(keyword);

  // 입력값 변경시, 300ms 후에 부모 컴포넌트로 전달
  useEffect(() => {
    const handler = setTimeout(() => setKeyword(localKeyword), 300);
    return () => clearTimeout(handler);
  }, [localKeyword]);

  // Enter 키로 검색
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(); // 부모 컴포넌트의 검색 실행 함수 호출
    }
  };

  // 검색어 변경
  const handleChange = (e) => setLocalKeyword(e.target.value);

  const widthClasses = {
    long: "w-[288px] sm:w-[560px] md:w-[1054px]",
    short: "w-[288px] sm:w-[242px] md:w-[325px]",
  };

  return (
    <div className="relative transition-all duration-300">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
      <input
        type="text"
        value={localKeyword}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="검색할 상품을 입력해주세요"
        className={`pl-12 pr-4 py-2 h-[44px] rounded-xl bg-gray-100 text-gray-600 placeholder-gray-400 text-sm md:text-base font-normal outline-none font-['Pretendard'] transition-all duration-300 ${widthClasses[variant]}`}
      />
    </div>
  );
}
