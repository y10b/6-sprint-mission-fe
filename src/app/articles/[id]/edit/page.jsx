"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function EditArticlePage() {
  const { id } = useParams(); // URL에서 id 추출
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // 게시글 불러오기
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/articles/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.error("게시글 로딩 실패:", err);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`http://localhost:5000/articles/${id}`, {
        title,
        content,
      });

      alert("게시글이 수정되었습니다!");
      router.push(`/articles/${id}`); // 수정 후 해당 게시글로 이동
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold text-secondary-800">게시글 수정</h1>
          <button
            type="submit"
            className="w-[74px] h-[42px] rounded-[8px] bg-gray-400 text-gray-100 font-[600] text-base"
          >
            등록
          </button>
        </div>
        <label className="text-[18px] font-bold text-secondary-800">
          *제목
        </label>
        <input
          className="w-full py-4 px-6 my-3 bg-gray-100 rounded-xl text-secondary-400"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="text-[18px] font-bold text-secondary-800">
          *내용
        </label>
        <textarea
          className="w-full h-[282px] resize-none py-4 px-6 my-3 bg-gray-100 rounded-xl text-secondary-400"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </form>
    </div>
  );
}
