"use client";

import React, { useState, useEffect, useRef } from "react";
import { MdMoreVert } from "react-icons/md";
import { useRouter } from "next/navigation";
import { logger } from "@/utils/logger";

import DeleteModal from "@/components/DeleteModal";

import { updateComment, deleteComment } from "@/lib/api/comments/commentsApi";
import { deleteProduct } from "@/lib/api/products/productsApi";
import { updateArticle, deleteArticle } from "@/lib/api/articles/articlesApi";

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleEdit = async () => {
    if (!itemId) return;

    if (type === "product") {
      router.push(`/products/${itemId.toString()}/edit`);
    } else if (type === "article") {
      router.push(`/articles/${itemId.toString()}/edit`);
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
          const title = prompt("수정할 제목을 입력해주세요") || "";
          if (!title) {
            alert("제목이 비어있습니다!");
            return;
          }
          await updateArticle(itemId, { title, content });
          alert("글 수정 성공!");
        }
        setIsOpen(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "수정에 실패했습니다.";
        alert(errorMessage);
      }
    }
  };

  // 삭제 확인 처리
  const handleConfirmDelete = async () => {
    try {
      switch (type) {
        case "product": {
          await deleteProduct(itemId.toString());
          alert("상품이 삭제되었습니다.");
          router.push("/products");
          break;
        }
        case "comment": {
          await deleteComment(itemId);
          alert("댓글 삭제 완료");
          if (onDelete) onDelete();
          break;
        }
        case "article": {
          await deleteArticle(itemId);
          alert("글 삭제 완료");
          if (onDelete) onDelete();
          router.push("/articles");
          break;
        }
        default:
          break;
      }
    } catch (error) {
      logger.error("삭제 실패:", error);
      const errorMessage =
        error instanceof Error ? error.message : "삭제에 실패했습니다.";
      alert(errorMessage);
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

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default DropdownMenu;
