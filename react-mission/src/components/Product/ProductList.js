import React, { useState, useEffect } from "react";
import { formatNumber } from "./utils";
import FavoriteButton from "./FavoriteButton";
import Filters from "./Filters"; // 필터 컴포넌트 임포트
import Search from "./Search"; // 검색 컴포넌트 임포트
import Pagination from "./Pagination"; // 페이지네이션 컴포넌트 임포트
import { getProductList, createProduct } from "./Products"; // API 호출 함수 임포트
import ProductForm from "./ProductForm"; // 상품 등록 폼 컴포넌트 임포트

const ProductList = ({
  page,
  pageSize,
  orderBy,
  keyword,
  setOrderBy,
  setKeyword,
  setPage, // 여기서 setPage를 제대로 전달 받음
}) => {
  const [items, setItems] = useState([]);
  const [hasNext, setHasNext] = useState(false); // 다음 페이지가 있는지 확인
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태
  const [showForm, setShowForm] = useState(false); // 상품 등록 폼 표시 상태

  // 상품 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductList(page, pageSize, orderBy, keyword);
      if (data) {
        setItems(data.list);
        setHasNext(data.hasNext); // hasNext 값을 받아와서 상태에 저장
        setTotalPages(data.totalPages); // totalPages 값을 받아와서 상태에 저장
      }
    };
    fetchData();
  }, [page, pageSize, orderBy, keyword]);

  // 정렬 기준에 따라 정렬
  const sortedItems = items.sort((a, b) => {
    if (orderBy === "recent") {
      // 최신 순: createdAt을 기준으로 내림차순 정렬
      return new Date(b.createdAt) - new Date(a.createdAt); // b가 더 최신일수록 앞으로
    } else if (orderBy === "favorite") {
      // 좋아요 순: favoriteCount을 기준으로 내림차순 정렬
      return b.favoriteCount - a.favoriteCount; // b가 더 많은 좋아요를 가질수록 앞으로
    }
    return 0;
  });

  // 상품 등록 폼을 표시하거나 숨기기 위한 함수
  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  // 상품 등록 폼 제출 처리
  const handleCreateProduct = async (productData) => {
    const newProduct = await createProduct(productData); // API 호출하여 상품 생성
    if (newProduct) {
      // 상품 생성 후 상품 목록 갱신
      setItems((prevItems) => [newProduct, ...prevItems]);
      setShowForm(false); // 폼 닫기
    }
  };

  return (
    <div>
      <div className="productList-header">
        <h2 className="productList-text">판매 중인 상품</h2>
        <div className="productList-FilterBox">
          <Search
            className="productList-Search"
            keyword={keyword}
            setKeyword={setKeyword}
          />
          <button className="productList-Btn" onClick={handleToggleForm}>
            상품 등록하기
          </button>
          <Filters
            className="productList-Filter"
            orderBy={orderBy}
            setOrderBy={setOrderBy}
          />
        </div>
      </div>

      {/* 상품 등록 폼이 열려 있으면 표시 */}
      {showForm && <ProductForm onSubmit={handleCreateProduct} />}

      <div className="products">
        <div className="productList-grid">
          {sortedItems.length > 0 ? (
            sortedItems.map((product) => (
              <div key={product.id} className="product-item">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="productsList-img"
                />
                <h3 className="name">{product.name}</h3>
                <p className="price">{formatNumber(product.price)}원</p>
                <FavoriteButton
                  productId={product.id}
                  initialCount={product.favoriteCount}
                />
              </div>
            ))
          ) : (
            <p>상품이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      <Pagination
        className="pagination"
        page={page}
        setPage={setPage}
        hasNext={hasNext}
        totalPages={totalPages}
      />
    </div>
  );
};

export default ProductList;
