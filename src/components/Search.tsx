import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchProps {
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  variant?: "short" | "long";
  onSearch: (text: string) => void;
}

export default function Search({
  keyword,
  setKeyword,
  variant = "long",
  onSearch,
}: SearchProps) {
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword.trim()) {
        onSearch(keyword);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      onSearch(keyword);
    }
  };

  return (
    <div
      className={`relative ${
        variant === "short" ? "w-[200px] sm:w-[240px]" : "w-full"
      }`}
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder="검색어를 입력해주세요"
        className="w-full h-10 pl-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={() => onSearch(keyword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      >
        <FiSearch size={20} />
      </button>
    </div>
  );
}
