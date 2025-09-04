"use client";

import React, { useEffect } from "react";

interface IToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  onRemove: (id: string) => void;
}

const Toast: React.FC<IToastProps> = ({
  id,
  message,
  type,
  duration = 3000,
  onRemove,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  // 타입별 스타일 설정
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500",
          icon: "✓",
          borderColor: "border-green-600",
        };
      case "error":
        return {
          bg: "bg-red-500",
          icon: "✕",
          borderColor: "border-red-600",
        };
      case "warning":
        return {
          bg: "bg-yellow-500",
          icon: "⚠",
          borderColor: "border-yellow-600",
        };
      case "info":
      default:
        return {
          bg: "bg-blue-500",
          icon: "ℹ",
          borderColor: "border-blue-600",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`
        ${styles.bg} ${styles.borderColor}
        text-white px-4 py-3 rounded-lg shadow-lg border-l-4
        flex items-center space-x-3 min-w-[300px] max-w-[400px]
        animate-slide-in-right
      `}
      style={{
        position: "relative",
        zIndex: 10000,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        marginBottom: "8px",
      }}
    >
      <div className="text-lg font-bold">{styles.icon}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={() => onRemove(id)}
        className="text-white hover:text-gray-200 transition-colors ml-2"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
