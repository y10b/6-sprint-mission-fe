"use client";
import React from "react";

interface ModalProps {
  message: string;
  onClose: () => void;
}

function Modal({ message, onClose }: ModalProps): React.ReactElement {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[300px] shadow-lg text-center">
        <p className="text-gray-800 text-base font-medium">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-md"
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default Modal;
