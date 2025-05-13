"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getProductById,
  updateProduct,
} from "@/features/products/services/productsApi";
import { uploadImage } from "@/features/images/imageUpload";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import TagInput from "@/components/TagInput";
import ImageUploader from "@/components/ImageUploader";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    tags: [],
    imageUrl: "", // images 대신 imageUrl로 수정
  });

  const [displayImages, setDisplayImages] = useState([]); // Display images as array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct({
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          tags: data.tags || [],
          imageUrl: data.imageUrl || "",
        });

        // imageUrl이 있으면 display용 이미지 배열에 추가
        if (data.imageUrl) {
          setDisplayImages([{ url: data.imageUrl }]); // Put the image into display array
        }
      } catch (err) {
        console.error("상품 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (field) => (e) => {
    const value = field === "price" ? Number(e.target.value) : e.target.value;
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      // 첫 번째 파일만 처리 (단일 이미지)
      const uploadedUrl = await uploadImage(files[0]);

      setProduct((prev) => ({
        ...prev,
        imageUrl: uploadedUrl,
      }));

      // 표시용 이미지 배열 업데이트
      setDisplayImages([{ url: uploadedUrl }]); // Update display array with new image
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleImageDelete = () => {
    setProduct((prev) => ({ ...prev, imageUrl: "" }));
    setDisplayImages([]); // Remove all displayed images
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(id, product);
      alert("상품이 수정되었습니다!");
      router.push(`/products/${id}`);
    } catch (err) {
      console.error("상품 수정 에러:", err);
      alert("상품 수정에 실패했습니다.");
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold text-secondary-800">상품 수정</h1>
          <button
            type="submit"
            className="w-[74px] h-[42px] rounded-lg bg-gray-400 text-gray-100 font-semibold text-base"
          >
            등록
          </button>
        </div>

        <ImageUploader
          image={displayImages[0]} // 배열의 첫 번째 이미지를 단일 객체로 전달
          handleImageChange={handleImageChange}
          handleImageDelete={handleImageDelete}
          error={false}
        />

        <FormInput
          label="*상품명"
          value={product.name}
          onChange={handleChange("name")}
          placeholder="상품명을 입력하세요"
        />

        <FormInput
          label="*가격"
          type="number"
          value={product.price}
          onChange={handleChange("price")}
          placeholder="가격을 입력하세요"
        />

        <FormTextarea
          label="*설명"
          value={product.description}
          onChange={handleChange("description")}
          placeholder="상품 설명을 입력하세요"
        />

        <TagInput
          label="*태그"
          tags={product.tags || []}
          setTags={(newTags) =>
            setProduct((prev) => ({ ...prev, tags: newTags }))
          }
          placeholder="예: 전자제품, 세일, 인기상품"
        />
      </form>
    </div>
  );
}
