"use client";

import { useState, useEffect, useCallback } from "react";
import { usePaginatedProducts } from "@/hooks/usePaginatedProducts";
import { formatNumber } from "@/utils/formatNumber";
import Search from "@/components/Search";
import Filters, { OrderByValue } from "@/components/Filters";
import Pagination from "@/components/Pagination";
import LikeToProduct from "@/components/LikeToProduct";
import Link from "next/link";
import Image from "next/image";
import BestProducts from "./BestProducts";
import { getImageUrl } from "@/utils/getImageUrl";
import { ProductsResponse, Product } from "@/types/product";
import { UseQueryResult } from "@tanstack/react-query";

export default function ProductList() {
  const [keyword, setKeyword] = useState<string>(""),
    [searchText, setSearchText] = useState<string>("");
  const [orderBy, setOrderBy] = useState<OrderByValue>("latest"),
    [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  }: UseQueryResult<ProductsResponse, Error> = usePaginatedProducts({
    page,
    pageSize,
    orderBy,
    keyword,
  });

  const products = data?.list || [],
    totalPages = Math.ceil((data?.totalCount || 0) / pageSize);

  const setResponsivePageSize = useCallback(() => {
    const w = window.innerWidth;
    const newPageSize = w <= 742 ? 4 : w <= 1198 ? 6 : 10;

    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setPage(1);
    }
  }, [pageSize]);

  useEffect(() => {
    setResponsivePageSize();
    window.addEventListener("resize", setResponsivePageSize);
    return () => window.removeEventListener("resize", setResponsivePageSize);
  }, [setResponsivePageSize]);

  const onSearch = (text: string) => {
    console.log("🔍 검색어 적용됨:", text);
    setKeyword(text);
    setPage(1);
  };

  const handleLikeToggle = () => {
    // 좋아요 토글 로직 구현
  };

  const handleOrderByChange = (value: OrderByValue) => {
    setOrderBy(value);
    setPage(1);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mt-6">
      <BestProducts />
      <div className="mt-10 flex justify-between items-center mb-8">
        <span className="text-xl font-bold">판매 중인 상품</span>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Search
            keyword={searchText}
            setKeyword={setSearchText}
            variant="short"
            onSearch={onSearch}
          />
          <Link href="/products/createProduct">
            <button className="cursor-pointer w-36 h-10 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-700">
              상품 등록하기
            </button>
          </Link>
          <Filters orderBy={orderBy} setOrderBy={handleOrderByChange} />
        </div>
      </div>

      {isError && <p className="text-red-500">불러오기 실패</p>}
      {isLoading && <p>로딩 중...</p>}

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {products.map(
          ({ id, name, price, images, favoriteCount, isLiked }: Product) => (
            <li key={id}>
              <Link href={`/products/${id}`}>
                <div className="relative w-full h-48 sm:h-56 md:h-64">
                  <Image
                    src={getImageUrl(images?.[0]) || "/img/making.png"}
                    alt={name}
                    fill
                    className="rounded-2xl object-cover"
                  />
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-medium leading-6 text-secondary-800">
                    {name}
                  </h3>
                  <p className="text-base font-bold leading-[26px] text-secondary-800">
                    {formatNumber(price)}원
                  </p>
                  <LikeToProduct
                    productId={id}
                    initialCount={favoriteCount}
                    initialIsFavorite={isLiked}
                    onLikeToggle={handleLikeToggle}
                    onLikeRemove={handleLikeToggle}
                  />
                </div>
              </Link>
            </li>
          )
        )}
      </ul>

      {isFetching && (
        <p className="text-center mt-4 text-gray-400">업데이트 중...</p>
      )}

      <div className="mt-10 mb-[135px]">
        <Pagination
          page={page}
          setPage={setPage}
          hasNext={page < totalPages}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
