import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Search from "./asset/Search.jsx"; // Search 컴포넌트 임포트
import Filters from "./asset/Filters"; // Filters 컴포넌트 임포트
import Pagination from "./asset/Pagination"; // Pagination 컴포넌트 임포트
import FavoriteButton from "./asset/FavoriteButton"; // FavoriteButton 임포트
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import { formatNumber } from "./asset/utils.js";

import "./css/ProductList.css";
import { baseURL } from "../../env.js";

const ProductList = ({ keyword, setKeyword, orderBy, setOrderBy }) => {
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // 현재 페이지 상태 추가
  const [pageSize, setPageSize] = useState(10); // 페이지당 아이템 개수 (기본값은 10)
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 상품 목록을 가져오는 함수
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/products`, {
        params: {
          offset: (page - 1) * pageSize, // 페이지에 맞는 오프셋 계산
          limit: pageSize, // 동적으로 설정한 페이지 크기
          sort: orderBy,
          search: keyword, // search에 keyword 추가
        },
        withCredentials: true, // 쿠키를 포함하여 요청
      });

      setItems(response.data); // 상품 목록을 response.data에서 바로 받아옴
      setTotalCount(response.data.length); // 데이터의 총 갯수 계산
      setHasNext(response.data.length > 0); // hasNext의 로직을 간단히 처리
    } catch (err) {
      setError("아이템을 불러오는 데 실패했습니다.");
      console.error("API 요청 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 좋아요 상태 업데이트 함수
  const handleFavoriteToggle = async (productId, currentFavoriteCount) => {
    try {
      const response = await axios.post(
        `${baseURL}/products/${productId}/like`,
        {},
        { withCredentials: true }
      ); // 좋아요 추가 API 호출
      if (response.status === 201) {
        // 좋아요가 추가된 경우
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === productId
              ? { ...item, favoriteCount: currentFavoriteCount + 1 }
              : item
          )
        );
      }
    } catch (err) {
      console.error("좋아요 추가 오류:", err);
    }
  };

  // 좋아요 삭제 함수
  const handleFavoriteRemove = async (productId, currentFavoriteCount) => {
    try {
      const response = await axios.delete(
        `${baseURL}/products/${productId}/like`,
        { withCredentials: true }
      ); // 좋아요 삭제 API 호출
      if (response.status === 200) {
        // 좋아요가 삭제된 경우
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === productId
              ? { ...item, favoriteCount: currentFavoriteCount - 1 }
              : item
          )
        );
      }
    } catch (err) {
      console.error("좋아요 삭제 오류:", err);
    }
  };

  useEffect(() => {
    fetchItems(); // keyword, orderBy, page, pageSize 변경 시마다 데이터 다시 가져오기
  }, [keyword, orderBy, page, pageSize]);

  // 검색 기능 처리
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // 검색할 때마다 첫 페이지로 리셋
    fetchItems(); // 키워드를 반영하여 아이템 목록을 가져옴
  };

  return (
    <>
      <Header />
      <div className="productListForm">
        <div className="productListHeader">
          <h1 className="productListText">판매 중인 상품</h1>
          <div className="productListHeaderAsset">
            <form onSubmit={handleSearch}>
              <Search keyword={keyword} setKeyword={setKeyword} />
            </form>
            <button
              className="productListBtn"
              onClick={() => navigate("/registration")} // navigate 사용하여 이동
            >
              상품 등록하기
            </button>
            <Filters orderBy={orderBy} setOrderBy={setOrderBy} />
          </div>
        </div>
        {error && <p>{error}</p>}
        {isLoading && <p>로딩 중...</p>}
        <ul className="productListGrid">
          {items.map((item) => (
            <li key={item.id} className="productItem">
              <img
                src={item.image || "/img/making.png"} // 수정된 필드명 (이미지 URL)
                alt={item.name}
                className="productListImg"
              />
              <div className="productDetails">
                <h3 className="productName">{item.name}</h3>
                <p className="productPrice">{formatNumber(item.price)}원</p>
                <FavoriteButton
                  productId={item.id}
                  initialCount={item.favoriteCount || 0}
                  onFavoriteToggle={handleFavoriteToggle}
                  onFavoriteRemove={handleFavoriteRemove} // 삭제 함수 추가
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
