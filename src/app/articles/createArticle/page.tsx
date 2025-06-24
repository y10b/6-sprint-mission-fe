"use client";

import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { createArticle } from "@/lib/api/articles/articlesApi";

interface Article {
  title: string;
  content: string;
}

const CreateArticle = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [contentError, setContentError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateTitle = (title: string): string => {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      return "제목을 입력해주세요.";
    }
    if (trimmedTitle.length > 10) {
      return "제목은 10자 이하이어야 합니다.";
    }
    return "";
  };

  const validateContent = (content: string): string => {
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return "내용을 입력해주세요.";
    }
    if (trimmedContent.length > 100) {
      return "내용은 100자 이하이어야 합니다.";
    }
    return "";
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setTitleError(validateTitle(newTitle));
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setContentError(validateContent(newContent));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const titleErrorMessage = validateTitle(title);
    const contentErrorMessage = validateContent(content);

    setTitleError(titleErrorMessage);
    setContentError(contentErrorMessage);

    if (!titleErrorMessage && !contentErrorMessage) {
      setIsSubmitting(true);

      try {
        await createArticle(title, content);
        router.push("/articles");
      } catch (error) {
        console.error("게시글 작성 오류:", error);
        alert("게시글 작성에 실패했습니다.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isFormValid = !titleError && !contentError && title && content;

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-primary">게시글 등록</h2>
          <button
            type="submit"
            className={`cursor-pointer p-2 rounded-lg text-gray-100 text-lg font-semibold w-[74px] ${
              isFormValid ? "bg-blue-500" : "bg-gray-400"
            }`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-xl mb-3 font-semibold text-gray-800">
            *제목
          </label>
          <input
            className={`w-full p-4 bg-gray-100 rounded-lg text-lg ${
              titleError ? "border-red-500" : "border-gray-300"
            } placeholder:text-gray-400`}
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={handleTitleChange}
          />
          {titleError && (
            <p className="text-red-500 text-sm mt-2">{titleError}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-3 text-xl font-semibold text-gray-800">
            *내용
          </label>
          <textarea
            className={`w-full h-[282px] bg-gray-100 p-4 rounded-lg text-lg ${
              contentError ? "border-red-500" : "border-gray-300"
            } placeholder:text-gray-400 resize-none`}
            placeholder="내용을 입력해주세요"
            value={content}
            onChange={handleContentChange}
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
