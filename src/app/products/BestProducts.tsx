"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/api/products/productsApi";
import LikeToProduct from "@/components/LikeToProduct";
import { formatNumber } from "@/utils/formatNumber";
import { getImageUrl } from "@/utils/getImageUrl";
import { IProduct } from "@/types/product";
import { logger } from "@/utils/logger";

function BestProducts() {
  const [bestProducts, setBestProducts] = useState<IProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 743) {
      setVisibleCount(1);
    } else if (width < 1199) {
      setVisibleCount(2);
    } else {
      setVisibleCount(4);
    }
  }, []);

  const handleLikeToggle = useCallback(() => {
    // 좋아요 토글 처리
  }, []);

  const handleLikeRemove = useCallback(() => {
    // 좋아요 제거 처리
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const response = await getProducts({
          page: 1,
          pageSize: 1000,
          orderBy: "likes",
        });

        const { list } = response;
        if (Array.isArray(list)) {
          const topLiked = list.slice(0, 4);
          setBestProducts(topLiked);
        }
      } catch (error) {
        logger.error("베스트 상품을 불러오는 데 실패했습니다.", error);
      }
    };
    fetchBestProducts();
  }, []);

  const textStrokeClass =
    "[text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]";

  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="absolute top-4 left-4 z-10">
          <h2 className={`text-xl font-bold text-white ${textStrokeClass}`}>
            베스트 상품
          </h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestProducts
            .slice(0, visibleCount)
            .map(({ id, images, name, price, favoriteCount, isLiked }) => (
              <li key={id} className="w-full">
                <Link href={`/products/${id}`}>
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                    <Image
                      src={getImageUrl(images?.[0])}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 743px) 100vw, (max-width: 1199px) 50vw, 25vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3
                        className={`text-sm font-medium leading-6 text-white line-clamp-2 ${textStrokeClass}`}
                      >
                        {name}
                      </h3>
                      <p
                        className={`mt-1 text-base font-bold leading-[26px] text-white ${textStrokeClass}`}
                      >
                        {formatNumber(price)}원
                      </p>
                      <div className="mt-2">
                        <LikeToProduct
                          productId={id}
                          initialCount={favoriteCount}
                          initialIsFavorite={isLiked}
                          onLikeToggle={handleLikeToggle}
                          onLikeRemove={handleLikeRemove}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default BestProducts;
