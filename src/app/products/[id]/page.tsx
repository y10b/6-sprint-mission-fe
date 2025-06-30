"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById } from "@/lib/api/products/productsApi";
import Image from "next/image";
import { formatNumber } from "@/utils/formatNumber";
import LikeToProduct from "@/components/LikeToProduct";
import CommentsProducts from "@/components/comments/_product/CommentsProducts";
import Link from "next/link";
import { TfiBackLeft } from "react-icons/tfi";
import DropdownMenu from "@/components/Dropdownmenu";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IProduct } from "@/types/product";

const ProductPage = () => {
  const { id } = useParams();

  const { user, isInitialized } = useAuth();
  const [product, setProduct] = useState<IProduct | null>(null);

  // React Query로 상품 데이터 가져오기
  const {
    data: productData,
    isPending: isLoading,
    error,
  } = useQuery<IProduct, Error>({
    queryKey: ["product", id],
    queryFn: () => getProductById(Number(id)),
    enabled: isInitialized && !!user && !!id,
  });

  // productData 로컬 상태에 반영
  useEffect(() => {
    if (productData) {
      setProduct(productData);
    }
  }, [productData]);

  if (!isInitialized) return <p>로딩 중...</p>;

  if (isLoading) return <p>상품 정보를 불러오는 중...</p>;

  if (error) return <p>상품을 불러오는 데 실패했습니다.</p>;
  if (!product) return <p>상품 정보를 불러올 수 없습니다.</p>;

  const {
    name,
    price,
    description,
    tags = [],
    id: productId,
    sellerNickname,
    updatedAt,
    favoriteCount,
    isLiked,
    images = [],
  } = product;

  const handleLikeToggle = () => {
    setProduct((prev: IProduct | null): IProduct | null => {
      if (!prev) return null; // prev가 null이면 그대로 null 반환

      return {
        ...prev,
        favoriteCount: prev.favoriteCount + 1,
        isLiked: !prev.isLiked,
        // id, name 등은 prev로부터 복사하므로 필수 필드 보장됨
      };
    });
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    pauseOnHover: true,
  };

  return (
    <div className="w-full max-w-4xl p-4 mt-6 mx-auto">
      <div className="sm:flex sm:gap-8">
        <div className="sm:w-1/2">
          <div className="relative h-[343px] sm:h-[400px] mb-4">
            {images.length > 0 ? (
              images.length === 1 ? (
                // 이미지가 하나일 경우 그냥 Image 컴포넌트로 렌더링
                <div className="relative h-[343px] sm:h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src={images[0]}
                    alt="상품 이미지"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              ) : (
                // 이미지가 여러 개일 경우 슬라이드 렌더링
                <Slider {...sliderSettings} className="h-full">
                  {images.map((src: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative h-[343px] sm:h-[400px] rounded-xl overflow-hidden"
                    >
                      <Image
                        src={src}
                        alt={`상품 이미지 ${idx + 1}`}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                  ))}
                </Slider>
              )
            ) : (
              <Image
                src="/img/making.png"
                alt="기본 이미지"
                fill
                className="rounded-xl object-cover"
              />
            )}
          </div>
        </div>

        <div className="sm:w-1/2 mt-4 sm:mt-0">
          <div className="flex justify-between items-start">
            <h1 className="text-base font-semibold text-secondary-800">
              {name}
            </h1>
            <DropdownMenu type="product" itemId={productId} />
          </div>

          <p className="text-2xl font-semibold text-secondary-800 my-4">
            {formatNumber(price)}원
          </p>

          <hr className="text-gray-200 mb-4" />

          <section className="mb-6">
            <h2 className="font-semibold text-sm text-secondary-800 mb-2">
              상품 소개
            </h2>
            <p className="text-base font-normal text-secondary-800">
              {description}
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-sm text-secondary-800 mb-2">
              상품 태그
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-4 py-[5px] bg-gray-100 text-base font-normal text-gray-800 rounded-full h-9"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <div className="mt-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/img/ic_profile.png"
                  alt="유저 프로필"
                  fill
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-medium text-sm text-secondary-600">
                  {sellerNickname}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-gray-300 text-lg">|</span>
              <div className="border w-20 h-8 rounded-full flex items-center justify-center border-secondary-200">
                <LikeToProduct
                  productId={productId}
                  initialCount={favoriteCount}
                  initialIsFavorite={isLiked}
                  onLikeToggle={handleLikeToggle}
                  onLikeRemove={handleLikeToggle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 mt-8" />

      <CommentsProducts productId={productId} />

      <div className="mt-16 text-center">
        <Link href="/products">
          <button className="mx-auto flex items-center justify-center gap-2 w-[280px] px-12 py-3 bg-primary-100 text-lg text-gray-100 font-semibold rounded-full hover:bg-primary-300">
            목록으로 돌아가기
            <TfiBackLeft className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductPage;
