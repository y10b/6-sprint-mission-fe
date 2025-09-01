import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { ISearchProps } from "@/types";

/**
 * 최적화된 검색 컴포넌트
 * - useCallback으로 함수 메모이제이션
 * - useMemo로 계산 결과 메모이제이션
 * - React.memo로 불필요한 리렌더링 방지
 */
const Search = memo(
  ({ keyword, setKeyword, variant = "long", onSearch }: ISearchProps) => {
    const [isComposing, setIsComposing] = useState(false);

    // 디바운싱된 검색 함수를 useCallback으로 메모이제이션
    const debouncedSearch = useCallback(
      (searchTerm: string) => {
        if (searchTerm.trim()) {
          onSearch(searchTerm);
        }
      },
      [onSearch]
    );

    // 디바운싱 로직 최적화
    useEffect(() => {
      const timer = setTimeout(() => {
        debouncedSearch(keyword);
      }, 500);

      return () => clearTimeout(timer);
    }, [keyword, debouncedSearch]); // debouncedSearch는 이제 안정적

    // 키다운 핸들러 메모이제이션
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isComposing) {
          e.preventDefault();
          onSearch(keyword);
        }
      },
      [keyword, isComposing, onSearch]
    );

    // 검색 버튼 클릭 핸들러 메모이제이션
    const handleSearchClick = useCallback(() => {
      onSearch(keyword);
    }, [keyword, onSearch]);

    // 입력 변경 핸들러 메모이제이션
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
      },
      [setKeyword]
    );

    // 컴포지션 이벤트 핸들러들 메모이제이션
    const handleCompositionStart = useCallback(() => {
      setIsComposing(true);
    }, []);

    const handleCompositionEnd = useCallback(() => {
      setIsComposing(false);
    }, []);

    // 컨테이너 클래스명을 useMemo로 최적화
    const containerClassName = useMemo(() => {
      const baseClass = "relative";
      const variantClass =
        variant === "short"
          ? "w-50 sm:w-[242px]"
          : "w-45 sm:w-140 md:w-[1054px]";
      return `${baseClass} ${variantClass}`;
    }, [variant]);

    // 입력 필드 클래스명 메모이제이션 (변경되지 않으므로)
    const inputClassName = useMemo(
      () =>
        "w-full h-[42px] pl-4 pr-10 rounded-md focus:outline-none bg-secondary-100 placeholder:text-secondary-400",
      []
    );

    return (
      <div className={containerClassName}>
        <input
          type="text"
          value={keyword}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder="검색어를 입력해주세요"
          className={inputClassName}
          aria-label="검색어 입력"
          autoComplete="off"
        />

        <button
          onClick={handleSearchClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="검색 실행"
          type="button"
        >
          <FiSearch size={20} />
        </button>
      </div>
    );
  }
);

Search.displayName = "Search";

export default Search;
