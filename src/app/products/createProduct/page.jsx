"use client";

import { useEffect, useState } from "react";
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
import { useAuth } from "@/context/AuthContext";

export default function CreateProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      alert("로그인이 필요한 페이지입니다.");
      router.push("/signin");
    }
  }, [isInitialized, user, router]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageObject = {
      file,
      url: URL.createObjectURL(file),
    };

    setImage(imageObject);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleImageDelete = () => {
    setImage(null);
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

    if (!image) newErrors.images = "이미지를 1장 등록해 주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // ✅ 여기에서 imageUrl 꺼내기
      const imageUrl = await uploadImage(image.file);

      const productData = {
        name,
        description,
        price: Number(price),
        tags,
        imageUrl, // ✅ 올바른 키 사용
      };

      console.log("등록 시 보낼 데이터:", productData);
      const result = await createProduct(productData);

      if (result.success) {
        router.push("/");
      } else {
        alert(`상품 등록 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("상품 등록 에러:", error);
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
          image={image}
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
