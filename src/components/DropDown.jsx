"use client";

import React, { useState, useEffect, useRef } from "react";
import { MdMoreVert } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/navigation";

const Dropdown = ({ articleId, commentId, baseUrl, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 수정하기
  const handleEdit = async () => {
    if (!commentId) {
      router.push("/createArticle");
      return;
    }

    const content = prompt("수정할 내용을 입력해주세요");
    if (!content) {
      alert("내용이 비어있습니다!");
      return;
    }

    try {
      const response = await axios.patch(
        `${baseUrl}/${articleId}/${commentId || ""}`,
        { content }
      );
      console.log("서버 응답:", response.data);
      alert(response.data.message || "수정 성공!");
      setIsOpen(false);
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정에 실패했습니다.");
    }
  };

  // 삭제하기
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const url = commentId
        ? `${baseUrl}/${articleId}/${commentId}`
        : `${baseUrl}/${articleId}`;

      const response = await axios.delete(url);
      alert(response.data.message || "삭제 완료");
      setIsOpen(false);
      if (onDelete) onDelete();
      if (!commentId) {
        router.push("/articles");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="relative inline-block text-left mt-2" ref={dropdownRef}>
      <MdMoreVert onClick={toggleDropdown} className="cursor-pointer" />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            <li
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center cursor-pointer"
              onClick={handleEdit}
            >
              수정하기
            </li>
            <li
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center cursor-pointer"
              onClick={handleDelete}
            >
              삭제하기
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
