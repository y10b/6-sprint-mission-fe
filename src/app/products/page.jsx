"use client";

import { useState, useEffect, useCallback } from "react";
import Search from "@/components/Search";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import LikeToProduct from "@/components/LikeToProduct";
import { formatNumber } from "@/components/utils";
import { usePaginatedProducts } from "@/hooks/usePaginatedProducts";
import Link from "next/link";
import Image from "next/image";

const ProductList = () => {
  const [keyword, setKeyword] = useState("");
  const [orderBy, setOrderBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const setResponsivePageSize = () => {
      const width = window.innerWidth;
      if (width <= 639) {
        setPageSize(4);
      } else if (width <= 742) {
        setPageSize(4);
      } else if (width <= 1198) {
        setPageSize(6);
      } else {
        setPageSize(10);
      }
    };

    setResponsivePageSize();
    window.addEventListener("resize", setResponsivePageSize);
    return () => window.removeEventListener("resize", setResponsivePageSize);
  }, []);

  const { data, isLoading, isError, isFetching } = usePaginatedProducts(
    { page, pageSize, orderBy, keyword },
    !!pageSize
  );

  const handleSearchSubmit = useCallback(
    (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      setKeyword(searchText);
      setPage(1);
    },
    [searchText]
  );

  const items = data?.products || [];
  const totalCount = data?.total || 0;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mt-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-secondary-900">판매 중인 상품</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Search
            keyword={searchText}
            setKeyword={setSearchText}
            variant="short"
            onSearch={handleSearchSubmit}
          />
          <Link href="/products/createProduct">
            <button className="w-36 h-10 rounded-md bg-blue-500 text-white font-semibold text-base hover:bg-blue-700 transition">
              상품 등록하기
            </button>
          </Link>
          <Filters
            orderBy={orderBy}
            setOrderBy={(value) => {
              setOrderBy(value);
              setPage(1); // 필터 변경 시도 페이지 초기화
            }}
          />
        </div>
      </div>

      {isError && (
        <p className="text-red-500">아이템을 불러오는 데 실패했습니다.</p>
      )}
      {isLoading && <p>로딩 중...</p>}

      <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {items.map((product) => (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>
              <div className="relative w-full h-48 sm:h-56 md:h-64">
                <Image
                  src={product.images?.[0] || "/img/making.png"}
                  alt={product.name}
                  fill
                  className="rounded-2xl object-cover"
                />
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-base font-bold text-gray-800">
                  {formatNumber(product.price)}원
                </p>
                <LikeToProduct
                  productId={product.id}
                  initialCount={product.favoriteCount || 0}
                  onFavoriteToggle={() => {}}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {isFetching && (
        <p className="text-center mt-4 text-gray-400">업데이트 중...</p>
      )}

      <div className="mt-10">
        <Pagination
          page={page}
          setPage={setPage}
          hasNext={page < Math.ceil(totalCount / pageSize)}
          totalPages={Math.ceil(totalCount / pageSize)}
        />
      </div>
    </div>
  );
};

export default ProductList;
