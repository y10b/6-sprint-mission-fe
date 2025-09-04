"use client";

import React, { useState, useEffect, useRef } from "react";
import { MdMoreVert } from "react-icons/md";

import DeleteModal from "@/components/DeleteModal";
import MessageModal from "@/components/MessageModal";
import EditModal from "@/components/EditModal";

import { useDropdownActions } from "@/hooks/useDropdownActions";
import { useToast } from "@/context/ToastContext";

interface IDropdownMenuProps {
  type: "product" | "article" | "comment";
  itemId: number;
  parentId?: number;
  baseUrl?: string;
  onDelete?: () => void;
}

const DropdownMenu: React.FC<IDropdownMenuProps> = ({
  type,
  itemId,
  parentId,
  baseUrl,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [messageModal, setMessageModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // 커스텀 훅 사용
  const { handleEdit, handleDelete, isLoading } = useDropdownActions({
    type,
    itemId,
    onDelete,
    onError: (message) => {
      setMessageModal({
        isOpen: true,
        title: "오류",
        message,
        type: "error",
      });
    },
    onToast: (message, type) => {
      showToast(message, type);
    },
  });

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 수정 버튼 클릭 처리
  const handleEditClick = () => {
    setIsOpen(false);

    if (type === "comment") {
      setIsEditModalOpen(true);
    } else {
      // product나 article의 경우 페이지 이동
      handleEdit();
    }
  };

  // 수정 모달에서 제출 처리
  const handleEditSubmit = (content: string) => {
    handleEdit(content);
    setIsEditModalOpen(false);
  };

  // 삭제 확인 처리
  const handleConfirmDelete = async () => {
    await handleDelete();
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="relative inline-block text-left mt-2" ref={dropdownRef}>
      <MdMoreVert onClick={toggleDropdown} className="cursor-pointer" />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[120px] bg-white border border-gray-300 rounded-md shadow-lg z-20">
          <ul className="py-1">
            <li
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center cursor-pointer"
              onClick={handleEditClick}
            >
              수정하기
            </li>
            <li
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                setIsDeleteModalOpen(true);
              }}
            >
              삭제하기
            </li>
          </ul>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* 댓글 수정 모달 */}
      <EditModal
        isOpen={isEditModalOpen}
        title="댓글 수정"
        placeholder="수정할 내용을 입력해주세요"
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
      />

      {/* 성공/오류 메시지 모달 */}
      <MessageModal
        isOpen={messageModal.isOpen}
        title={messageModal.title}
        message={messageModal.message}
        type={messageModal.type}
        onClose={() => setMessageModal({ ...messageModal, isOpen: false })}
      />
    </div>
  );
};

export default DropdownMenu;
