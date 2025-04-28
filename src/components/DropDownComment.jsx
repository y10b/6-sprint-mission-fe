"use client";

import React, { useState, useEffect, useRef } from "react";
import { MdMoreVert } from "react-icons/md";
import axios from "axios";

const DropdownComment = ({ productId, commentId, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = async () => {
    if (!commentId) return;

    const content = prompt("수정할 내용을 입력해주세요");
    if (!content) {
      alert("내용이 비어있습니다!");
      return;
    }

    const token = localStorage.getItem("accessToken"); // 토큰 가져오기
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.patch(
        `https://panda-market-api.vercel.app/comments/${commentId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("댓글 수정 성공!");
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert(error.response?.data?.message || "댓글 수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!commentId) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.delete(
        `https://panda-market-api.vercel.app/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("댓글 삭제 완료");
      setIsOpen(false);
      if (onDelete) onDelete(); // 삭제 후 목록 다시 불러오기
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert(error.response?.data?.message || "댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="relative inline-block text-left mt-2" ref={dropdownRef}>
      <MdMoreVert onClick={toggleDropdown} className="cursor-pointer" />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[102px] sm:w-[139px] bg-white border border-gray-300 rounded-md shadow-lg">
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

export default DropdownComment;
