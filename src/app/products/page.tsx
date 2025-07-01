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
import { IProductsResponse, IProduct } from "@/types/product";
import { UseQueryResult } from "@tanstack/react-query";

export default function ProductList() {
  const [search, setSearch] = useState<{ keyword: string; text: string }>({
    keyword: "",
    text: "",
  });

  const [orderBy, setOrderBy] = useState<OrderByValue>("latest");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  }: UseQueryResult<IProductsResponse, Error> = usePaginatedProducts({
    page,
    pageSize,
    orderBy,
    keyword: search.keyword,
  });

  const products = data?.list || [],
    totalPages = Math.ceil((data?.totalCount || 0) / pageSize);

  const setResponsivePageSize = useCallback(() => {
    const w = window.innerWidth;
    const newPageSize = w < 743 ? 4 : w < 1199 ? 6 : 10;

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
    setSearch((prev) => ({ ...prev, keyword: text }));
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

      <div className="mt-10 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* 모바일: 첫 번째 줄 (제목 + 버튼), 태블릿/PC: 왼쪽 */}
          <div className="flex items-center justify-between sm:block">
            <h2 className="text-xl font-bold whitespace-nowrap">
              판매 중인 상품
            </h2>
            <div className="sm:hidden">
              <Link href="/products/createProduct">
                <button className="cursor-pointer whitespace-nowrap px-4 h-10 rounded-md bg-primary-100 text-white font-semibold hover:bg-primary-200">
                  상품 등록하기
                </button>
              </Link>
            </div>
          </div>

          {/* 모바일: 두 번째 줄 (검색 + 필터), 태블릿/PC: 오른쪽 */}
          <div className="flex flex-row items-center gap-2 sm:w-auto">
            <div className="flex-1 sm:w-[280px]">
              <Search
                keyword={search.text}
                setKeyword={(value) =>
                  setSearch((prev) => ({
                    ...prev,
                    text:
                      typeof value === "function" ? value(prev.text) : value,
                  }))
                }
                variant="short"
                onSearch={onSearch}
              />
            </div>
            <div className="hidden sm:block">
              <Link href="/products/createProduct">
                <button className="cursor-pointer w-[133px] h-[42px] bg-primary-100 rounded-[8px] text-gray-100 font-semibold text-base leading-[26px]">
                  상품 등록하기
                </button>
              </Link>
            </div>
            <Filters orderBy={orderBy} setOrderBy={handleOrderByChange} />
          </div>
        </div>
      </div>

      {isError && <p className="text-red-500">불러오기 실패</p>}
      {isLoading && <p>로딩 중...</p>}

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
        {products.map(
          ({ id, name, price, images, favoriteCount, isLiked }: IProduct) => (
            <li key={id}>
              <Link href={`/products/${id}`}>
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={getImageUrl(images?.[0]) || "/img/making.png"}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 743px) 50vw, (max-width: 1199px) 33vw, 20vw"
                  />
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-medium leading-6 text-secondary-800 line-clamp-2">
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
