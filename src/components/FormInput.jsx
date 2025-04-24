"use client";
import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function FormInput({
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
  const inputBaseClass =
    "focus:outline-none focus:ring-2 w-full h-[56px] py-4 px-6 rounded-xl font-[400] text-base leading-[26px] placeholder:text-secondary-400";
  const errorBorder = "border border-red-500 focus:ring-red-500";
  const normalBorder = "bg-gray-100 focus:ring-primary-100";

  return (
    <div className="mt-4">
      <label className="block font-bold text-[14px] sm:text-[18px] mb-2 text-gray-800">
        {label}
      </label>
      <div className="relative">
        <input
          type={showToggle ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${inputBaseClass} pr-12 ${
            error ? errorBorder : normalBorder
          }`}
        />
        {showToggle && (
          <div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={onToggle}
          >
            {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default FormInput;
