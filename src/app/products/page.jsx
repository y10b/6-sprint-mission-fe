"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [pageSize, setPageSize] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth <= 768) setPageSize(4);
      else if (window.innerWidth <= 1024) setPageSize(6);
      else setPageSize(10);
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  useEffect(() => {
    console.log("페이지 상태 확인 👉", { page, pageSize, orderBy, keyword });
  }, [page, pageSize, orderBy, keyword]);

  const { data, isLoading, isError } = usePaginatedProducts(
    {
      page,
      pageSize,
      orderBy,
      keyword,
    },
    !!pageSize
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const items = data?.products || [];
  const totalCount = data?.totalCount || 0;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center my-6 gap-4 sm:gap-0">
        <h1 className="text-xl font-bold text-gray-900">판매 중인 상품</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <form onSubmit={handleSearch}>
            <Search keyword={keyword} setKeyword={setKeyword} variant="short" />
          </form>
          <button
            className="w-36 h-10 rounded-md bg-blue-500 text-white font-semibold text-base hover:bg-blue-700 transition"
            onClick={() => router.push("/registration")}
          >
            상품 등록하기
          </button>
          <Filters orderBy={orderBy} setOrderBy={setOrderBy} />
        </div>
      </div>

      {isError && (
        <p className="text-red-500">아이템을 불러오는 데 실패했습니다.</p>
      )}
      {isLoading && <p>로딩 중...</p>}

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 ">
        {items.map((product) => (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>
              <div className="relative w-55 h-55 ">
                <Image
                  src={
                    product.images.length > 0 && product.images[0] !== ""
                      ? product.images[0]
                      : "/img/making.png"
                  }
                  className="rounded-2xl object-cover"
                  alt={product.name}
                  fill
                />
              </div>
              <div className="mt-4">
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

      <div className="mt-8">
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
