"use client";

import React, { useState, useEffect, useRef } from "react";
import { MdMoreVert } from "react-icons/md";
import { useRouter } from "next/navigation";

import DeleteModal from "@/components/DeleteModal"; // ✅ 모달 import

import {
  updateComment,
  deleteComment,
} from "@/features/comments/services/commentsApi";
import { deleteProduct } from "@/features/products/services/productsApi";
import {
  updateArticle,
  deleteArticle,
} from "@/features/articles/services/articlesApi";

const DropdownMenu = ({ type, itemId, parentId, baseUrl, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // ✅ 모달 상태 추가
  const dropdownRef = useRef(null);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = async () => {
    if (!itemId) return;

    if (type === "product") {
      router.push(`/products/${itemId}/edit`);
    } else if (type === "article" && !parentId) {
      router.push(`/articles/${itemId}/edit`);
    } else {
      const content = prompt("수정할 내용을 입력해주세요");
      if (!content) {
        alert("내용이 비어있습니다!");
        return;
      }

      try {
        if (type === "comment") {
          await updateComment(itemId, content);
          alert("댓글 수정 성공!");
          window.location.reload();
        } else if (type === "article") {
          await updateArticle(baseUrl, parentId, itemId, content);
          alert("글 수정 성공!");
        }
        setIsOpen(false);
      } catch (error) {
        alert(error.message || "수정에 실패했습니다.");
      }
    }
  };

  // 삭제 확인 처리
  const handleConfirmDelete = async () => {
    try {
      if (type === "product") {
        await deleteProduct(itemId);
        alert("상품이 삭제되었습니다.");
        router.push("/products");
      } else if (type === "comment") {
        await deleteComment(itemId);
        alert("댓글 삭제 완료");
        if (onDelete) onDelete();
      } else if (type === "article") {
        await deleteArticle(baseUrl, parentId, itemId);
        alert("글 삭제 완료");
        if (onDelete) onDelete();
        router.push("/articles");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      alert(error.message || "삭제에 실패했습니다.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left mt-2" ref={dropdownRef}>
      <MdMoreVert onClick={toggleDropdown} className="cursor-pointer" />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[120px] bg-white border border-gray-300 rounded-md shadow-lg z-20">
          <ul className="py-1">
            <li
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center cursor-pointer"
              onClick={handleEdit}
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

      {/* ✅ 삭제 모달 */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default DropdownMenu;
