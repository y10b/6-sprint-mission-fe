"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  validateProductName,
  validateDescription,
  validatePrice,
  validateTags,
} from "@/utils/formValidation";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import ImageUploader from "@/components/ImageUploader";
import TagInput from "@/components/TagInput";
import { uploadImage } from "@/features/images/imageUpload";
import { createProduct } from "@/features/products/services/productsApi";

export default function CreateProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 3) {
      setErrors((prev) => ({
        ...prev,
        images: "최대 3장까지 업로드 가능합니다.",
      }));
      return;
    }

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleImageDelete = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateProductName(name))
      newErrors.name = "상품명은 2자 이상 15자 이하로 입력해 주세요.";

    if (!validateDescription(description))
      newErrors.description = "설명은 10자 이상 100자 이하로 입력해 주세요.";

    if (!validatePrice(price))
      newErrors.price = "가격은 0보다 큰 숫자여야 합니다.";

    if (!validateTags(tags)) newErrors.tags = "태그를 1개 이상 입력해 주세요.";

    if (images.length === 0)
      newErrors.images = "이미지를 1장 이상 등록해 주세요.";
    else if (images.length > 3)
      newErrors.images = "최대 3장까지 업로드 가능합니다.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const uploadedUrls = await Promise.all(
        images.map((img) => uploadImage(img.file))
      );

      const productData = {
        name,
        description,
        price: Number(price),
        tags,
        images: uploadedUrls,
      };

      const result = await createProduct(productData);

      if (result.success) {
        router.push("/");
      } else {
        alert(`상품 등록 실패: ${result.error}`);
      }
    } catch {
      alert("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit}>
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
          error={errors.images}
        />

        <FormInput
          label="상품명"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="상품명을 입력하세요"
          error={errors.name}
        />

        <FormTextarea
          label="상품 소개"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="상품 소개를 입력하세요"
          error={errors.description}
        />

        <FormInput
          label="가격"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="가격을 입력하세요"
          error={errors.price}
        />

        <TagInput
          label="태그"
          tags={tags}
          setTags={setTags}
          placeholder="태그를 입력해 주세요"
          error={errors.tags}
        />
      </form>
    </div>
  );
}
