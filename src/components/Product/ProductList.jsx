import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header/Header.js";
import Footer from "../Footer/Footer.js";
import Search from "./asset/Search.jsx"; // Search 컴포넌트 임포트
import Filters from "./asset/Filters"; // Filters 컴포넌트 임포트
import Pagination from "./asset/Pagination"; // Pagination 컴포넌트 임포트
import FavoriteButton from "./asset/FavoriteButton"; // FavoriteButton 임포트
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import { formatNumber } from "./asset/utils.js";

import "./css/ProductList.css";

const ProductList = ({ keyword, setKeyword, orderBy, setOrderBy }) => {
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // 현재 페이지 상태 추가
  const [pageSize, setPageSize] = useState(10); // 페이지당 아이템 개수 (기본값은 10)
  const navigate = useNavigate(); // useNavigate 훅 사용

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3002/api/items", {
        params: {
          offset: (page - 1) * pageSize, // 페이지에 맞는 오프셋 계산
          pageSize: pageSize, // 동적으로 설정한 페이지 크기
          sort: orderBy,
          search: keyword,
        },
        withCredentials: true, // 쿠키를 포함하여 요청
      });

      setItems(response.data.items);
      setTotalCount(response.data.totalCount);
      setHasNext(response.data.hasNext);
    } catch (err) {
      setError("아이템을 불러오는 데 실패했습니다.");
      console.error("API 요청 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 화면 크기에 따라 페이지당 표시될 상품 개수를 설정
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1200) {
        setPageSize(10); // 기본 화면에서는 10개
      } else if (width >= 744) {
        setPageSize(6); // 태블릿 화면에서는 6개
      } else {
        setPageSize(4); // 모바일 화면에서는 4개
      }
    };

    handleResize(); // 초기 로드 시 화면 크기 설정
    window.addEventListener("resize", handleResize); // 화면 크기 변경 시마다 실행

    return () => window.removeEventListener("resize", handleResize); // 컴포넌트가 언마운트될 때 이벤트 제거
  }, []);

  useEffect(() => {
    setItems([]); // 새로 검색되었을 때 상품 목록 초기화
    fetchItems(); // 상품 리스트 가져오기
  }, [keyword, orderBy, page, pageSize]); // keyword, orderBy, page, pageSize 변경 시마다 데이터 다시 가져오기

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // 검색할 때마다 첫 페이지로 리셋
    fetchItems();
  };

  return (
    <>
      <Header />
      <div className="ProductListForm">
        <div className="productList-header">
          <h1 className="productList-text">판매 중인 상품</h1>
          <div className="productList-header-asset">
            <form onSubmit={handleSearch}>
              <Search keyword={keyword} setKeyword={setKeyword} />
            </form>
            <button
              className="productList-Btn"
              onClick={() => navigate("/registration")} // navigate 사용하여 이동
            >
              상품 등록하기
            </button>
            <Filters orderBy={orderBy} setOrderBy={setOrderBy} />
          </div>
        </div>
        {error && <p>{error}</p>}
        {isLoading && <p>로딩 중...</p>}
        <ul className="productList-grid">
          {items.map((item) => (
            <li key={item.id} className="product-item">
              <img
                src={
                  item.images && item.images.length > 0
                    ? item.images[0]
                    : "/img/making.png" // 기본 이미지 경로 수정
                }
                alt={item.name}
                className="productsList-img" // 이미지 스타일 추가
              />
              <div className="product-details">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-price">{formatNumber(item.price)}원</p>
                <FavoriteButton
                  productId={item.id}
                  initialCount={item.favoriteCount || 0}
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
      <Footer />
    </>
  );
};

export default ProductList;
