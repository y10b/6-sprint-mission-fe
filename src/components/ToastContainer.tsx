"use client";

import React from "react";
import Toast from "./Toast";

export interface IToast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface IToastContainerProps {
  toasts: IToast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<IToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
