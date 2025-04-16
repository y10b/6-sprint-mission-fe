"use client";

import React, { useState, useEffect, useRef } from "react";
import { MdMoreVert } from "react-icons/md";
import axios from "axios";

const Dropdown = ({ articleId, commentId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 드롭다운 외부를 클릭했을 때 닫히게 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 댓글 수정하기
  const handleEditComment = async () => {
    const content = prompt("수정할 댓글 내용을 입력해주세요");

    if (!content) {
      alert("댓글 내용이 비어있습니다!");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/comments/articles/${articleId}/${commentId}`,
        { content }
      );
      alert(response.data.message);
      setIsOpen(false); // 드롭다운 닫기
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제하기
  const handleDeleteComment = async () => {
    if (window.confirm("정말 댓글을 삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/comments/articles/${articleId}/${commentId}`
        );
        alert(response.data.message);
        setIsOpen(false); // 드롭다운 닫기
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
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
              onClick={handleEditComment}
            >
              수정하기
            </li>
            <li
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center cursor-pointer"
              onClick={handleDeleteComment}
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
