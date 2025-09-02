"use client";
import React from "react";

interface IModalProps {
  message: string;
  onClose: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

function Modal({
  message,
  onClose,
  onCancel,
  showCancel = false,
}: IModalProps): React.ReactElement {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[320px] shadow-lg text-center">
        <p className="text-gray-800 text-base font-medium mb-6">{message}</p>

        {showCancel ? (
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-400 transition"
            >
              취소
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
            >
              로그인하기
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
          >
            확인
          </button>
        )}
      </div>
    </div>
  );
}

export default Modal;
