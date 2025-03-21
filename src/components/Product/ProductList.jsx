import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Search from "./asset/Search.jsx";
import Filters from "./asset/Filters";
import Pagination from "./asset/Pagination";
import LikeToProduct from "./asset/LikeToProduct.jsx";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "./asset/utils.js";
import "./css/ProductList.css";
import { baseURL } from "../../env.js";

const ProductList = ({ keyword, setKeyword, orderBy, setOrderBy }) => {
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 기본 pageSize 설정
  const navigate = useNavigate();

  // 화면 크기에 맞춰 페이지 크기 조정
  const updatePageSize = () => {
    const width = window.innerWidth;
    if (width >= 1200) {
      setPageSize(10); // 데스크탑 화면에서는 10개씩
    } else if (width >= 744) {
      setPageSize(6); // 태블릿 화면에서는 6개씩
    } else {
      setPageSize(4); // 모바일 화면에서는 4개씩
    }
  };

  // 상품 목록을 가져오는 함수
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/products`, {
        params: {
          offset: (page - 1) * pageSize, // 페이지에 맞는 오프셋 계산
          limit: pageSize, // 동적으로 설정한 페이지 크기
          sort: orderBy, // 정렬 기준 전달
          search: keyword, // 검색어 전달
        },
        withCredentials: true, // 쿠키를 포함하여 요청
      });

      setItems(response.data.products); // 상품 목록을 response.data.products에서 받아옴
      setTotalCount(response.data.totalCount); // 총 갯수 설정
      setHasNext(response.data.products.length > 0); // hasNext 로직
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

  // 페이지 변경 시 데이터 다시 불러오기
  useEffect(() => {
    fetchItems();
  }, [keyword, orderBy, page, pageSize]); // keyword가 변경될 때마다 fetchItems 호출

  // 화면 크기 변화에 따른 페이지 크기 업데이트
  useEffect(() => {
    updatePageSize(); // 처음 로딩 시 페이지 크기 설정
    window.addEventListener("resize", updatePageSize); // 화면 크기 변경 시 처리

    return () => {
      window.removeEventListener("resize", updatePageSize); // 언마운트 시 리스너 제거
    };
  }, []);

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
                <LikeToProduct
                  productId={item.id}
                  initialCount={item.favoriteCount || 0}
                  onFavoriteToggle={handleFavoriteToggle} // onFavoriteToggle 전달
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
