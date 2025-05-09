"use client";

import { useState, useEffect, useCallback } from "react";
import { usePaginatedProducts } from "@/hooks/usePaginatedProducts";
import { formatNumber } from "@/components/utils";
import Search from "@/components/Search";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import LikeToProduct from "@/components/LikeToProduct";
import Link from "next/link";
import Image from "next/image";
import BestProducts from "./BestProducts";
import { getImageUrl } from "@/utils/getImageUrl";

export default function ProductList() {
  const [keyword, setKeyword] = useState(""),
    [searchText, setSearchText] = useState("");
  const [orderBy, setOrderBy] = useState("latest"),
    [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, isFetching } = usePaginatedProducts(
    { page, pageSize, orderBy, keyword },
    !!pageSize
  );

  const products = data?.products || [],
    totalPages = Math.ceil((data?.total || 0) / pageSize);
  const setResponsivePageSize = useCallback(() => {
    const w = window.innerWidth;
    setPageSize(w <= 742 ? 4 : w <= 1198 ? 6 : 10);
  }, []);

  useEffect(() => {
    setResponsivePageSize();
    window.addEventListener("resize", setResponsivePageSize);
    return () => window.removeEventListener("resize", setResponsivePageSize);
  }, [setResponsivePageSize]);

  const onSearch = (e) => {
    e?.preventDefault();
    setKeyword(searchText);
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
          <Filters
            orderBy={orderBy}
            setOrderBy={(v) => {
              setOrderBy(v);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isError && <p className="text-red-500">불러오기 실패</p>}
      {isLoading && <p>로딩 중...</p>}

      <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map(
          ({ id, name, price, imageUrl, favoriteCount, isLiked }) => (
            <li key={id}>
              <Link href={`/products/${id}`}>
                <div className="relative w-full h-48 sm:h-56 md:h-64">
                  <Image
                    src={getImageUrl(imageUrl) || "/img/making.png"}
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
                    initialCount={favoriteCount || 0} // 수정
                    initialIsFavorite={isLiked}
                    onFavoriteToggle={() => {}}
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

      <div className="mt-10">
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
