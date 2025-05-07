"use client";

import { FiEye, FiEyeOff } from "react-icons/fi";

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  showToggle,
  onToggle,
  showPassword,
}) {
  const inputClasses = [
    "w-full h-[56px] py-4 px-6 rounded-xl font-[400] text-base leading-[26px]",
    "placeholder:text-secondary-400 focus:outline-none focus:ring-2",
    error
      ? "border border-red-500 focus:ring-red-500"
      : "bg-gray-100 focus:ring-primary-100",
    showToggle && "pr-12",
  ]
    .filter(Boolean)
    .join(" ");

  const inputType = showToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mt-4">
      {label && (
        <label className="block font-bold text-[14px] sm:text-[18px] mb-2 text-gray-800">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
