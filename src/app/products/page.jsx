"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Search from "@/components/Search";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import LikeToProduct from "@/components/LikeToProduct";
import { formatNumber } from "@/components/utils";
import styles from "./style.module.css";
import { usePaginatedProducts } from "@/hooks/usePaginatedProducts";
import Link from "next/link";

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

  //디버깅
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
    !!pageSize // pageSize가 설정된 경우에만 쿼리 실행
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const items = data?.products || [];
  const totalCount = data?.totalCount || 0;

  return (
    <div className={styles.productListForm}>
      <div className={styles.productListHeader}>
        <h1 className={styles.productListText}>판매 중인 상품</h1>
        <div className={styles.productListHeaderAsset}>
          <form onSubmit={handleSearch}>
            <Search keyword={keyword} setKeyword={setKeyword} variant="short" />
          </form>
          <button
            className={styles.productListBtn}
            onClick={() => router.push("/registration")}
          >
            상품 등록하기
          </button>
          <Filters orderBy={orderBy} setOrderBy={setOrderBy} />
        </div>
      </div>

      {isError && <p>아이템을 불러오는 데 실패했습니다.</p>}
      {isLoading && <p>로딩 중...</p>}

      <ul className={styles.productListGrid}>
        {items.map((product) => (
          <li key={product.id} className={styles.productItem}>
            <Link href={`/products/${product.id}`}>
              <img
                src={product.images || "/img/making.png"}
                alt={product.name}
                className={styles.productListImg}
              />
              <div className={styles.productDetails}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>
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

      <Pagination
        page={page}
        setPage={setPage}
        hasNext={page < Math.ceil(totalCount / pageSize)}
        totalPages={Math.ceil(totalCount / pageSize)}
      />
    </div>
  );
};

export default ProductList;
