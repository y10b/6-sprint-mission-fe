"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import ToastContainer, { IToast } from "@/components/ToastContainer";

interface IToastContextType {
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<IToastContextType | undefined>(undefined);

interface IToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<IToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info",
      duration = 3000
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: IToast = {
        id,
        message,
        type,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): IToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
