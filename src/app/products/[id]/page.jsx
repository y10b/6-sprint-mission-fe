"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById } from "@/features/products/services/productsApi";
import Image from "next/image";
import { formatNumber } from "@/components/utils";
import LikeToProduct from "@/components/LikeToProduct";
import CommentsProducts from "@/components/comments/_product/CommentsProducts";
import Link from "next/link";
import { TfiBackLeft } from "react-icons/tfi";
import DropdownMenu from "@/components/Dropdownmenu";
import { useAuth } from "@/context/AuthContext";

const ProductPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const { user, isInitialized } = useAuth();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !isInitialized) return;

    // 로그인 안 된 경우
    if (!user) {
      alert("로그인이 필요한 페이지입니다.");
      router.push("/signin");
      return;
    }

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id); // 서버에서 데이터 가져옴
        setProduct(data); // data에는 isLiked 정보도 포함되어 있어야 함
      } catch (err) {
        console.error("상품 불러오기 실패:", err);
        setError("상품을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, isInitialized, user, router]);

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>상품 정보를 불러올 수 없습니다.</p>;

  const {
    imageUrl,
    name,
    price,
    description,
    tags = [],
    id: productId,
    sellerNickname, // sellerNickname을 받아옴
    updatedAt,
    favoriteCount,
    isLiked, // 서버에서 받아온 isLiked 상태
  } = product;

  const handleLikeToggle = (id, count) => {
    setProduct((prev) => ({
      ...prev,
      favoriteCount: count,
      isLiked: !prev.isLiked,
    }));
  };

  return (
    <div className="w-full max-w-4xl p-4 mt-6 mx-auto">
      <div className="sm:flex sm:gap-8">
        <div className="sm:w-1/2">
          <div className="relative h-[343px] sm:h-[400px] mb-4">
            <Image
              src={imageUrl || "/img/making.png"}
              alt={name}
              fill
              className="rounded-xl object-cover"
            />
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
              {tags.map((tag, idx) => (
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
                {/* sellerId 대신 sellerNickname 사용 */}
                <p className="font-medium text-sm text-secondary-600">
                  {sellerNickname} {/* 여기에 닉네임을 표시 */}
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
                  initialIsFavorite={isLiked} // 서버에서 받아온 isLiked 상태를 사용
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
