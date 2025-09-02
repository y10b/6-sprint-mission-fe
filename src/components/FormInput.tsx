import React, { forwardRef } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface IFormInputProps {
  label: string;
  error?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  showPassword?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, IFormInputProps>(
  (
    {
      label,
      type = "text",
      error,
      showToggle,
      onToggle,
      showPassword,
      className = "",
      value,
      onChange,
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div className="mb-6">
        <label className="block text-base font-semibold text-gray-800 mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={
              showToggle && showPassword !== undefined
                ? showPassword
                  ? "text"
                  : "password"
                : type
            }
            className={`w-full h-14 px-6 rounded-xl bg-gray-100 border ${
              error ? "border-red-500" : "border-transparent"
            } focus:outline-none focus:border-blue-500 ${className}`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
          />
          {showToggle && onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm font-semibold text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
