"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArticle, updateArticle } from "@/lib/api/articles/articlesApi";
import ImageUploader from "@/components/ImageUploader";
import { uploadImage } from "@/lib/api/images/imageUpload";
import type { TArticleFormData } from "@/types/article";

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<TArticleFormData>({
    title: "",
    content: "",
    images: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(Number(id));
        setForm((prev) => ({
          ...prev,
          title: data.title,
          content: data.content,
          image: data.images || "",
        }));
        setPreviewUrl(data.images || null);
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
      let imageUrl: string | undefined = previewUrl || undefined;
      if (image) {
        try {
          imageUrl = await uploadImage(image);
        } catch (err) {
          console.error("이미지 업로드 실패:", err);
          setImageError("이미지 업로드에 실패했습니다.");
          setIsSubmitting(false);
          return;
        }
      }
      await updateArticle(Number(id), form.title, form.content, imageUrl);
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageError("");
  };

  const handleImageDelete = () => {
    setImage(null);
    setPreviewUrl(null);
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
          value={form.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          disabled={isSubmitting}
        />
        <label className="text-[18px] font-bold text-secondary-800">
          *내용
        </label>
        <textarea
          className="w-full h-[282px] resize-none py-4 px-6 my-3 bg-gray-100 rounded-xl placeholder:text-secondary-400"
          placeholder="내용"
          value={form.content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setForm((prev) => ({ ...prev, content: e.target.value }))
          }
          disabled={isSubmitting}
        />
        <ImageUploader
          images={
            previewUrl
              ? [{ file: image ?? new File([], ""), url: previewUrl }]
              : []
          }
          handleImageChange={handleImageChange}
          handleImageDelete={handleImageDelete}
          error={imageError}
        />
      </form>
    </div>
  );
}
