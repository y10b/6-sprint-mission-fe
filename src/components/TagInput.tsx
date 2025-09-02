import React, { useState, KeyboardEvent } from "react";
import { FiX } from "react-icons/fi";

interface ITagInputProps {
  label: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
}

export default function TagInput({
  label,
  tags,
  setTags,
  placeholder = "태그를 입력하세요",
  error,
}: ITagInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedInput = input.trim();
      if (trimmedInput && !tags.includes(trimmedInput)) {
        setTags([...tags, trimmedInput]);
        setInput("");
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="mb-6">
      <label className="block text-base font-semibold text-gray-800 mb-2">
        {label}
      </label>
      <div
        className={`min-h-14 px-6 rounded-xl bg-gray-100 border ${
          error ? "border-red-500" : "border-transparent"
        } focus-within:border-blue-500`}
      >
        <div className="flex flex-wrap gap-2 py-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:text-blue-200"
              >
                <FiX size={16} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 min-w-[120px] bg-transparent outline-none"
          />
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm font-semibold text-red-500">{error}</p>
      )}
    </div>
  );
}
