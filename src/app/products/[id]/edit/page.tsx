"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/lib/api/products/productsApi";
import { uploadImage } from "@/lib/api/images/imageUpload";
import { useUpdateProduct } from "@/lib/react-query";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import TagInput from "@/components/TagInput";
import ImageUploader from "@/components/ImageUploader";
import MessageModal from "@/components/MessageModal";
import { TUpdateProductInput } from "@/types/product";

// 로컬 타입 정의
interface EditableProductFields {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
}

interface UploadedImage {
  file: File;
  url: string;
}

interface EditProductFormState extends EditableProductFields {
  isValid: boolean;
  isDirty: boolean;
  sellerId?: number;
}
import { useAuth } from "@/context/AuthContext";
import { logger } from "@/utils/logger";
import { useToast } from "@/context/ToastContext";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const updateProductMutation = useUpdateProduct();

  const [product, setProduct] = useState<EditProductFormState>({
    name: "",
    description: "",
    price: 0,
    tags: [],
    images: [],
    isValid: false,
    isDirty: false,
  });

  const [displayImages, setDisplayImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(Number(id));

        // 현재 로그인한 사용자가 판매자가 아니면 상품 상세 페이지로 리다이렉트
        if (!user || user.id !== data.sellerId) {
          setErrorModal({
            isOpen: true,
            title: "접근 권한 없음",
            message: "상품 수정 권한이 없습니다.",
          });
          setTimeout(() => {
            router.push(`/products/${id}`);
          }, 2000);
          return;
        }

        setProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          tags: data.tags,
          images: data.images,
          isValid: true,
          isDirty: false,
          sellerId: data.sellerId,
        });

        if (data.images && data.images.length > 0) {
          const existingImages = await Promise.all(
            data.images.map(async (url: string) => {
              try {
                const response = await fetch(url);
                const blob = await response.blob();
                const fileName = url.split("/").pop() || "image.jpg";
                const file = new File([blob], fileName, {
                  type: blob.type,
                });
                return { file, url };
              } catch (error) {
                logger.error("이미지 변환 실패", error);
                const placeholderFile = new File([], "placeholder.jpg", {
                  type: "image/jpeg",
                });
                return { file: placeholderFile, url };
              }
            })
          );
          setDisplayImages(existingImages);
        }
      } catch (err) {
        logger.error("상품 불러오기 실패", err);
        setError("상품을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router, user]);

  const validateForm = (
    updatedProduct: Partial<EditableProductFields>
  ): boolean => {
    const currentProduct = { ...product, ...updatedProduct };
    return (
      currentProduct.name.length > 0 &&
      currentProduct.description.length > 0 &&
      currentProduct.price > 0 &&
      currentProduct.tags.length > 0 &&
      currentProduct.images.length > 0
    );
  };

  const handleChange =
    (field: keyof EditableProductFields) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === "price" ? Number(e.target.value) : e.target.value;
      const updatedFields = { [field]: value };

      setProduct((prev: EditProductFormState) => ({
        ...prev,
        ...updatedFields,
        isDirty: true,
        isValid: validateForm(updatedFields),
      }));
    };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const uploadedUrls = await Promise.all(files.map(uploadImage));

      const updatedFields = {
        images: [...product.images, ...uploadedUrls],
      };

      setProduct((prev: EditProductFormState) => ({
        ...prev,
        ...updatedFields,
        isDirty: true,
        isValid: validateForm(updatedFields),
      }));

      setDisplayImages((prev: UploadedImage[]) => [
        ...prev,
        ...files.map((file, index) => ({
          file,
          url: uploadedUrls[index],
        })),
      ]);
    } catch (error) {
      logger.error("이미지 업로드 실패", error);
      setError("이미지 업로드에 실패했습니다.");
    }
  };

  const handleImageDelete = (indexToRemove: number) => {
    const updatedFields = {
      images: product.images.filter((_, index) => index !== indexToRemove),
    };

    setProduct((prev) => ({
      ...prev,
      ...updatedFields,
      isDirty: true,
      isValid: validateForm(updatedFields),
    }));

    setDisplayImages((prev: UploadedImage[]) =>
      prev.filter((_: UploadedImage, index: number) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !product.isValid) return;

    const updateData: TUpdateProductInput = {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      imageUrls: product.images,
    };

    try {
      // React Query mutation 사용으로 자동 캐시 무효화
      await updateProductMutation.mutateAsync({
        productId: id.toString(),
        data: updateData,
      });
      // 성공 시 토스트 알림
      showToast("상품이 수정되었습니다!", "success");
      router.push(`/products/${id}`);
    } catch (err) {
      logger.error("상품 수정 에러", err);
      // 오류 시 모달 표시
      setErrorModal({
        isOpen: true,
        title: "수정 실패",
        message: "상품 수정에 실패했습니다. 다시 시도해주세요.",
      });
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
            disabled={!product.isValid || !product.isDirty}
            className={`w-[74px] h-[42px] rounded-lg ${
              product.isValid && product.isDirty
                ? "bg-primary-100 hover:bg-primary-200 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            } text-gray-100 font-semibold text-base transition-colors`}
          >
            등록
          </button>
        </div>

        <ImageUploader
          images={displayImages}
          handleImageChange={handleImageChange}
          handleImageDelete={handleImageDelete}
          error={error}
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
          tags={product.tags}
          setTags={(newTags: string[]) =>
            setProduct((prev: EditProductFormState) => ({
              ...prev,
              tags: newTags,
              isDirty: true,
              isValid: validateForm({ tags: newTags }),
            }))
          }
          placeholder="예: 전자제품, 세일, 인기상품"
        />
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
}
