"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const CreateArticle = () => {
  const router = useRouter();
  const [title, setTitle] = useState(""); // 제목 상태
  const [content, setcontent] = useState(""); // 내용 상태
  const [titleError, setTitleError] = useState(""); // 제목 오류 메시지 상태
  const [contentError, setcontentError] = useState(""); // 내용 오류 메시지 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 상태

  // 제목 유효성 검사
  const validateTitle = (title) => {
    const trimmedTitle = title.trim(); // 공백 제거
    if (trimmedTitle.length === 0) {
      return "제목을 입력해주세요.";
    }
    if (trimmedTitle.length > 10) {
      return "제목은 10자 이하이어야 합니다.";
    }
    return "";
  };

  // 내용 유효성 검사
  const validatecontent = (content) => {
    const trimmedcontent = content.trim(); // 공백 제거
    if (trimmedcontent.length === 0) {
      return "내용을 입력해주세요.";
    }
    if (trimmedcontent.length > 100) {
      return "내용은 100자 이하이어야 합니다.";
    }
    return "";
  };

  // 실시간으로 유효성 검사
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setTitleError(validateTitle(newTitle)); // 실시간으로 유효성 검사
  };

  const handlecontentChange = (e) => {
    const newcontent = e.target.value;
    setcontent(newcontent);
    setcontentError(validatecontent(newcontent)); // 실시간으로 유효성 검사
  };

  // 폼 제출 시 유효성 검사 및 처리
  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    const titleErrorMessage = validateTitle(title);
    const contentErrorMessage = validatecontent(content);

    // 오류 메시지 설정
    setTitleError(titleErrorMessage);
    setcontentError(contentErrorMessage);

    // 유효성 검사 통과 시 POST 요청
    if (!titleErrorMessage && !contentErrorMessage) {
      setIsSubmitting(true); // 제출 상태 업데이트

      // POST 요청
      fetch("http://localhost:5000/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("게시글 작성 완료:", data);
          router.push("/articles");
        })
        .catch((error) => {
          console.error("게시글 작성 오류:", error);
        })
        .finally(() => {
          setIsSubmitting(false); // 제출 상태 초기화
        });
    }
  };

  const isFormValid = !titleError && !contentError && title && content;

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-primary">게시글 쓰기</h2>
          <button
            type="submit"
            className={`p-2 rounded-lg text-gray-100 text-lg font-semibold w-[74px] ${
              isFormValid ? "bg-blue-500" : "bg-gray-400"
            }`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-xl font-semibold text-gray-800">
            *제목
          </label>
          <input
            className={`w-full p-4 bg-gray-100 rounded-lg text-lg ${
              titleError ? "border-red-500" : "border-gray-300"
            } text-gray-400`}
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={handleTitleChange}
          />
          {titleError && (
            <p className="text-red-500 text-sm mt-2">{titleError}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-xl font-semibold text-gray-800">
            *내용
          </label>
          <textarea
            className={`w-full h-[282px] bg-gray-100 p-4 rounded-lg text-lg ${
              contentError ? "border-red-500" : "border-gray-300"
            } text-gray-400 resize-none`}
            placeholder="내용을 입력해주세요"
            value={content}
            onChange={handlecontentChange}
          ></textarea>
          {contentError && (
            <p className="text-red-500 text-sm mt-2">{contentError}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;
