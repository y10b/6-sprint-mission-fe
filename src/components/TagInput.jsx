"use client";

import { useState } from "react";
import { TiDelete } from "react-icons/ti";

export default function TagInput({
  label,
  tags = [],
  setTags,
  placeholder,
  error,
}) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault(); // form 제출 방지
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const handleDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <div className="mt-4">
      {label && (
        <label className="block font-bold text-[14px] sm:text-[18px] mb-2 text-gray-800">
          {label}
        </label>
      )}

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={[
          "w-full h-[56px] py-4 px-6 rounded-xl font-[400] text-base leading-[26px]",
          "placeholder:text-secondary-400 focus:outline-none focus:ring-2",
          error
            ? "border border-red-500 focus:ring-red-500"
            : "bg-gray-100 focus:ring-primary-100",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {/* 태그 리스트 */}
      <div className="flex flex-wrap mt-[14px] gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center rounded-full py-[6px] px-3 bg-gray-100 font-normal text-base leading-[26px] text-secondary-800"
          >
            #{tag}
            <button
              type="button"
              onClick={() => handleDelete(tag)}
              className="ml-2 cursor-pointer"
            >
              <TiDelete className="text-xl text-gray-400" />
            </button>
          </div>
        ))}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
