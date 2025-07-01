"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  validateProductName,
  validateDescription,
  validatePrice,
} from "@/utils/formValidation";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import ImageUploader from "@/components/ImageUploader";
import TagInput from "@/components/TagInput";
import { uploadImage } from "@/lib/api/images/imageUpload";
import { createProduct } from "@/lib/api/products/productsApi";
import { useAuth } from "@/context/AuthContext";
import type { CreateProductFormData, ImageData } from "@/types/product";
import { logger } from "@/utils/logger";

export default function CreateProduct() {
  const router = useRouter();
  const { user, isInitialized } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      tags: [],
    },
  });

  const tags = watch("tags") as string[];

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      alert("로그인이 필요한 페이지입니다.");
      router.push("/signin");
    }
  }, [isInitialized, user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || images.length >= 3) return;

    const imageObject = {
      file,
      url: URL.createObjectURL(file),
    };

    setImages([...images, imageObject]);
    setImageError("");
  };

  const handleImageDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateProductFormData) => {
    if (images.length === 0) {
      setImageError("이미지를 1장 이상 등록해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrls = await Promise.all(
        images.map((image) => uploadImage(image.file))
      );

      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        tags: data.tags,
        imageUrls,
      };

      const result = await createProduct(productData);

      if (result.success) {
        router.push("/");
      } else {
        alert(`상품 등록 실패: ${result.error}`);
      }
    } catch (error) {
      logger.error("상품 등록 에러:", error);
      alert("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-800">상품 등록</h1>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-[74px] h-[48px] rounded-xl font-semibold text-base text-white transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </div>

        <ImageUploader
          images={images}
          handleImageChange={handleImageChange}
          handleImageDelete={handleImageDelete}
          error={imageError}
        />

        <FormInput
          label="상품명"
          placeholder="상품명을 입력하세요"
          error={errors.name?.message}
          {...register("name", {
            required: "상품명을 입력해주세요.",
            validate: (value) =>
              validateProductName(value) ||
              "상품명은 2자 이상 15자 이하로 입력해 주세요.",
          })}
        />

        <FormTextarea
          label="상품 소개"
          placeholder="상품 소개를 입력하세요"
          error={errors.description?.message}
          {...register("description", {
            required: "상품 소개를 입력해주세요.",
            validate: (value) =>
              validateDescription(value) ||
              "설명은 10자 이상 100자 이하로 입력해 주세요.",
          })}
        />

        <FormInput
          label="가격"
          type="number"
          placeholder="가격을 입력하세요"
          error={errors.price?.message}
          {...register("price", {
            valueAsNumber: true,
            required: "가격을 입력해주세요.",
            validate: (value) =>
              validatePrice(value) || "가격은 0보다 큰 숫자여야 합니다.",
          })}
        />

        <TagInput
          label="태그"
          tags={tags}
          setTags={(newTags: string[]) => setValue("tags", newTags)}
          placeholder="태그를 입력해 주세요"
          error={errors.tags?.message}
        />
      </form>
    </div>
  );
}
