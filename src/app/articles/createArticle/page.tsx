"use client";

import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import ImageUploader from "@/components/ImageUploader";
import { uploadImage } from "@/lib/api/images/imageUpload";
import { useCreateArticle } from "@/lib/react-query";
import MessageModal from "@/components/MessageModal";
import { logger } from "@/utils/logger";
import { useToast } from "@/context/ToastContext";

const CreateArticle = () => {
  const router = useRouter();
  const { showToast } = useToast();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [imageError, setImageError] = useState<string>("");
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

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
    setErrors((prev) => ({ ...prev, title: validateTitle(newTitle) }));
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setErrors((prev) => ({ ...prev, content: validateContent(newContent) }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageError("");
  };

  const { mutateAsync: submitArticle, isPending } = useCreateArticle();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const titleErrorMessage = validateTitle(title);
    const contentErrorMessage = validateContent(content);

    setErrors({ title: titleErrorMessage, content: contentErrorMessage });

    if (!titleErrorMessage && !contentErrorMessage) {
      const articleData = await createArticleData();
      if (articleData) {
        try {
          await submitArticle(articleData);
          // 성공 시 토스트 알림
          showToast("게시글이 작성되었습니다!", "success");
          router.push("/articles");
        } catch (error) {
          // 오류 시 모달 표시
          setErrorModal({
            isOpen: true,
            title: "작성 실패",
            message: "게시글 작성에 실패했습니다. 다시 시도해주세요.",
          });
        }
      }
    }
  };

  const createArticleData = async () => {
    let imageUrl: string | undefined = undefined;
    if (image) {
      try {
        imageUrl = await uploadImage(image);
      } catch (err) {
        logger.error("이미지 업로드 실패:", err);
        setImageError("이미지 업로드에 실패했습니다.");
        return null;
      }
    }
    return {
      title,
      content,
      images: imageUrl,
    };
  };

  const isFormValid = !errors.title && !errors.content && title && content;

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
            disabled={!isFormValid || isPending}
          >
            {isPending ? "등록 중..." : "등록"}
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-xl mb-3 font-semibold text-gray-800">
            *제목
          </label>
          <input
            className={`w-full p-4 bg-gray-100 rounded-lg text-lg ${
              errors.title ? "border-red-500" : "border-gray-300"
            } placeholder:text-gray-400`}
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={handleTitleChange}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-2">{errors.title}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-3 text-xl font-semibold text-gray-800">
            *내용
          </label>
          <textarea
            className={`w-full h-[282px] bg-gray-100 p-4 rounded-lg text-lg ${
              errors.content ? "border-red-500" : "border-gray-300"
            } placeholder:text-gray-400 resize-none`}
            placeholder="내용을 입력해주세요"
            value={content}
            onChange={handleContentChange}
          ></textarea>
          {errors.content && (
            <p className="text-red-500 text-sm mt-2">{errors.content}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-xl font-semibold text-gray-800 mb-2">
            이미지 (선택)
          </label>
          <ImageUploader
            images={
              previewUrl ? [{ file: image as File, url: previewUrl }] : []
            }
            handleImageChange={handleImageChange}
            handleImageDelete={() => {
              setImage(null);
              setPreviewUrl(null);
            }}
            error={imageError}
          />
        </div>
      </form>

      {/* 오류 모달 */}
      <MessageModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        type="error"
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
      />
    </div>
  );
};

export default CreateArticle;
