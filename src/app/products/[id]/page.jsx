"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById } from "@/actions/products";
import Image from "next/image";
import Dropdown from "@/components/DropDown";
import { formatNumber } from "@/components/utils";
import LikeToProduct from "@/components/LikeToProduct";
import CommentsProducts from "@/components/comments/_product/CommentsProducts";
import Link from "next/link";
import { TfiBackLeft } from "react-icons/tfi";

const ProductPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요한 페이지입니다.");
      router.push("/signin");
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("상품을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>상품 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="w-full max-w-4xl p-4 mt-6 mx-auto">
      {/* 이미지 + 상품 정보 */}
      <div className="sm:flex sm:gap-8">
        {/* 이미지 영역 */}
        <div className="sm:w-1/2">
          {product.images.length > 0 ? (
            product.images.map((image, index) => (
              <div key={index} className="relative h-[343px] sm:h-[400px] mb-4">
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
            ))
          ) : (
            <div className="relative h-[343px] sm:h-[400px] mb-4">
              <Image
                src="/img/making.png"
                alt={product.name}
                fill
                className="rounded-xl object-cover"
              />
            </div>
          )}
        </div>

        {/* 상품 정보 영역 */}
        <div className="sm:w-1/2 mt-4 sm:mt-0">
          <div className="flex justify-between">
            <span className="text-base font-semibold leading-[26px] mb-2 text-secondary-800">
              {product.name}
            </span>
            <Dropdown />
          </div>

          <p className="text-2xl font-semibold leading-8 mb-4 text-secondary-800">
            {formatNumber(product.price)}원
          </p>

          <hr className="text-gray-200 mb-4" />

          <span className="font-semibold text-[14px] leading-6 text-secondary-800 mb-2">
            상품 소개
          </span>
          <p className="font-[400] text-base leading-[26px] text-secondary-800 mb-6">
            {product.description}
          </p>

          <span className="font-semibold text-[14px] leading-6 text-secondary-800">
            상품 태그
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-[5px] bg-gray-100 text-base font-[400] leading-[26px] text-gray-800 rounded-[26px] h-9 text-center"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 유저 정보 + 좋아요 버튼 */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
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
                  <p className="font-medium text-[14px] leading-6 text-secondary-600">
                    {product.ownerNickname}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-gray-300 text-lg">|</span>
                <div className="border w-20 h-8 rounded-[35px] py-1 px-5.5 border-secondary-200">
                  <LikeToProduct
                    productId={product.id}
                    initialCount={product.favoriteCount}
                    onLikeToggle={(id, count) =>
                      setProduct((prev) => ({ ...prev, favoriteCount: count }))
                    }
                    onLikeRemove={(id, count) =>
                      setProduct((prev) => ({ ...prev, favoriteCount: count }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-gray-200 mt-8" />
      {/* 댓글 */}
      <CommentsProducts productId={product.id} />

      {/* 돌아가기 버튼 */}
      <div className="mt-16 text-center">
        <Link href="/products">
          <button className="mx-auto flex gap-2 w-[240px] px-12 py-3 bg-primary-100 text-[18px] text-gray-100 font-[600] rounded-[40px] hover:bg-primary-300 cursor-pointer relative">
            목록으로 돌아가기
            <span className="absolute right-6 top-4.5">
              <TfiBackLeft className="w-[19px] h-4" />
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductPage;
