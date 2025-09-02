import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface IDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteModal({ isOpen, onClose, onConfirm }: IDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-md p-6 w-[250px]">
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-2xl text-red-500" />
        </div>
        <h2 className="font-medium text-base leading-[26px] text-secondary-800 text-center mb-8">
          정말로 삭제하시겠습니까?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="cursor-pointer w-22 h-12 rounded-xl px-3 bg-gray-50 border-1 border-red-500 font-semibold text-base leading-[26px] text-red-500"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer w-22 h-12 rounded-xl px-3 bg-red-500 font-semibold text-base leading-[26px] text-gray-100 "
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
