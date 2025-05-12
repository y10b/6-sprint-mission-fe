import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/features/products/services/productsApi";
import LikeToProduct from "@/components/LikeToProduct";
import { formatNumber } from "@/components/utils";
import { getImageUrl } from "@/utils/getImageUrl";

function BestProducts() {
  const [bestProducts, setBestProducts] = useState([]);
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

        const { products } = response;
        if (Array.isArray(products)) {
          const topLiked = products
            .map((product) => ({
              ...product,
              favoriteCount: product.favoriteCount ?? 0, // 백엔드에서 _count.likes로 옴
              isLiked: product.isLiked ?? false,
            }))
            .slice(0, 4);

          setBestProducts(topLiked);
        }
      } catch (error) {
        console.error("베스트 상품을 불러오는 데 실패했습니다.", error);
      }
    };
    fetchBestProducts();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">베스트 상품</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]">
        {bestProducts
          .slice(0, visibleCount)
          .map(({ id, imageUrl, name, price, favoriteCount, isLiked }) => (
            <li key={id}>
              <Link href={`/products/${id}`}>
                <div className="relative w-full h-[343px] md:h-[282px] mb-2 rounded-[19.46px] overflow-hidden cursor-pointer">
                  <Image
                    src={getImageUrl(imageUrl)}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 743px) 100vw,
                     (max-width: 1199px) 50vw,
                     25vw"
                  />
                </div>

                <h3 className="mb-[6px] text-sm font-medium leading-6 text-secondary-800">
                  {name}
                </h3>
                <p className="mb-[6px] text-base font-bold leading-[26px] text-secondary-800">
                  {formatNumber(price)}원
                </p>

                <LikeToProduct
                  productId={id}
                  initialCount={favoriteCount}
                  initialIsFavorite={isLiked}
                />
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default BestProducts;
