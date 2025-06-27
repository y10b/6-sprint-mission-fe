import { FiEye, FiEyeOff } from "react-icons/fi";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  toggleType?: boolean;
  onToggle?: () => void;
  show?: boolean;
  register: UseFormRegisterReturn;
}

export default function AuthFormField({
  label,
  id,
  type = "text",
  placeholder = "",
  error,
  toggleType = false,
  onToggle,
  show,
  register,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block font-bold text-[18px] leading-[26px] text-secondary-800"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={
            toggleType && show !== undefined
              ? show
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          className={`bg-gray-100 mt-4 w-full h-14 py-4 px-6 border rounded-xl focus:outline-none ${
            error ? "border-red-500" : "border-0"
          }`}
          {...register}
        />
        {toggleType && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/5 text-gray-500"
          >
            {show ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="ml-4 mt-2 font-semibold text-[14px] leading-6 text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
