"use client";

export default function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  error,
}) {
  const textareaClasses = [
    "resize-none w-full min-h-[282px] py-4 px-6 rounded-xl font-[400] text-base leading-[26px]",
    "placeholder:text-secondary-400 focus:outline-none focus:ring-2",
    error
      ? "border border-red-500 focus:ring-red-500"
      : "bg-gray-100 focus:ring-primary-100",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mt-4">
      {label && (
        <label className="block font-bold text-[14px] sm:text-[18px] mb-2 text-gray-800">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={textareaClasses}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
