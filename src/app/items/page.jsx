"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Search from "@/components/Search";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import LikeToProduct from "@/components/LikeToProduct";
import { formatNumber } from "@/components/utils";
import styles from "./style.module.css";

const ProductList = () => {
  const [keyword, setKeyword] = useState(""); // 검색어 상태
  const [orderBy, setOrderBy] = useState("recent"); // 정렬 기준 상태
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 기본 pageSize 설정 (데스크탑 기준)
  const router = useRouter();

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/products", {
        params: {
          offset: (page - 1) * pageSize,
          limit: pageSize,
          sort: orderBy,
          search: keyword,
        },
        withCredentials: true,
      });

      setItems(response.data.products);
      setTotalCount(response.data.totalCount);
      setHasNext(response.data.products.length > 0);
    } catch (err) {
      setError("아이템을 불러오는 데 실패했습니다.");
      console.error("API 요청 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 화면 크기에 맞춰 pageSize 변경
  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth <= 768) {
        setPageSize(4); // 모바일 화면에서는 4개
      } else if (window.innerWidth <= 1024) {
        setPageSize(6); // 태블릿 화면에서는 6개
      } else {
        setPageSize(10); // 데스크탑 화면에서는 10개
      }
    };

    // 초기 실행
    updatePageSize();

    // 화면 크기 변경 시마다 호출
    window.addEventListener("resize", updatePageSize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", updatePageSize);
    };
  }, []);

  useEffect(() => {
    fetchItems();
  }, [keyword, orderBy, page, pageSize]); // 의존성 배열에 pageSize 추가

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // 검색 시 첫 페이지로 리셋
    fetchItems();
  };

  return (
    <>
      <div className={styles.productListForm}>
        <div className={styles.productListHeader}>
          <h1 className={styles.productListText}>판매 중인 상품</h1>
          <div className={styles.productListHeaderAsset}>
            <form onSubmit={handleSearch}>
              <Search
                keyword={keyword}
                setKeyword={setKeyword}
                variant="short"
              />
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
        {error && <p>{error}</p>}
        {isLoading && <p>로딩 중...</p>}
        <ul className={styles.productListGrid}>
          {items.map((item) => (
            <li key={item.id} className={styles.productItem}>
              <img
                src={item.image || "/img/making.png"}
                alt={item.name}
                className={styles.productListImg}
              />
              <div className={styles.productDetails}>
                <h3 className={styles.productName}>{item.name}</h3>
                <p className={styles.productPrice}>
                  {formatNumber(item.price)}원
                </p>
                <LikeToProduct
                  productId={item.id}
                  initialCount={item.favoriteCount || 0}
                  onFavoriteToggle={() => {}}
                />
              </div>
            </li>
          ))}
        </ul>
        <Pagination
          page={page}
          setPage={setPage}
          hasNext={hasNext}
          totalPages={Math.ceil(totalCount / pageSize)}
        />
      </div>
    </>
  );
};

export default ProductList;
