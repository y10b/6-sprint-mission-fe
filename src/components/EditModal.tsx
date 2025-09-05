"use client";

import React, { useState, useEffect } from "react";

interface IEditModalProps {
  isOpen: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
  isLoading?: boolean;
}

const EditModal: React.FC<IEditModalProps> = ({
  isOpen,
  title,
  placeholder,
  initialValue = "",
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* 헤더 */}
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
            disabled={isLoading}
            autoFocus
          />
        </form>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={() => {
              if (value.trim()) {
                onSubmit(value.trim());
              }
            }}
            disabled={isLoading || !value.trim()}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            )}
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;


