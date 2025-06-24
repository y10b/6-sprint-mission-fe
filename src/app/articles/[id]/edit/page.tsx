"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArticle, updateArticle } from "@/lib/api/articles/articlesApi";
import { Article } from "@/types/article";

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(Number(id));
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error("게시글 로딩 실패:", err);
        setError("게시글을 불러오는데 실패했습니다.");
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await updateArticle(Number(id), title, content);
      alert("게시글이 수정되었습니다!");
      router.push(`/articles/${id}`);
    } catch (err) {
      console.error("수정 실패:", err);
      setError("게시글 수정에 실패했습니다.");
      alert("수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold text-secondary-800">게시글 수정</h1>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-[74px] h-[42px] rounded-[8px] ${
              isSubmitting ? "bg-gray-300" : "bg-gray-400"
            } text-gray-100 font-[600] text-base`}
          >
            {isSubmitting ? "수정 중..." : "등록"}
          </button>
        </div>
        <label className="text-[18px] font-bold text-secondary-800">
          *제목
        </label>
        <input
          className="w-full py-4 px-6 my-3 bg-gray-100 rounded-xl  placeholder:text-secondary-400"
          placeholder="제목"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          disabled={isSubmitting}
        />
        <label className="text-[18px] font-bold text-secondary-800">
          *내용
        </label>
        <textarea
          className="w-full h-[282px] resize-none py-4 px-6 my-3 bg-gray-100 rounded-xl placeholder:text-secondary-400"
          placeholder="내용"
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}
