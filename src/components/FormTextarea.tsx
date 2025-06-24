import React, { forwardRef } from "react";

interface FormTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "ref"> {
  label: string;
  error?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="mb-6">
        <label className="block text-base font-semibold text-gray-800 mb-2">
          {label}
        </label>
        <textarea
          ref={ref}
          className={`w-full h-32 px-6 py-4 rounded-xl bg-gray-100 border ${
            error ? "border-red-500" : "border-transparent"
          } focus:outline-none focus:border-blue-500 resize-none ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm font-semibold text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
