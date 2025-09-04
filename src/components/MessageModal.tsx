"use client";

import React from "react";

interface IMessageModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const MessageModal: React.FC<IMessageModalProps> = ({
  isOpen,
  title,
  message,
  type,
  onClose,
  onConfirm,
  confirmText = "확인",
  cancelText = "취소",
}) => {
  if (!isOpen) return null;

  // 타입별 스타일 설정
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          headerBg: "bg-green-500",
          buttonBg: "bg-green-500 hover:bg-green-600",
          icon: "✓",
        };
      case "error":
        return {
          headerBg: "bg-red-500",
          buttonBg: "bg-red-500 hover:bg-red-600",
          icon: "✕",
        };
      case "warning":
        return {
          headerBg: "bg-yellow-500",
          buttonBg: "bg-yellow-500 hover:bg-yellow-600",
          icon: "⚠",
        };
      case "info":
      default:
        return {
          headerBg: "bg-blue-500",
          buttonBg: "bg-blue-500 hover:bg-blue-600",
          icon: "ℹ",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* 헤더 */}
        <div
          className={`${styles.headerBg} text-white p-4 rounded-t-lg flex items-center`}
        >
          <div className="text-xl mr-3">{styles.icon}</div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        {/* 메시지 내용 */}
        <div className="p-6">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-white rounded transition-colors ${styles.buttonBg}`}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className={`px-4 py-2 text-white rounded transition-colors ${styles.buttonBg}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
