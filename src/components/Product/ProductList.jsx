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
  setPage,
  favoriteCounts,
  onFavoriteToggle, // 추가된 prop
}) => {
  const [items, setItems] = useState([]);
  const [hasNext, setHasNext] = useState(false); // 다음 페이지가 있는지 확인
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태
  const [showForm, setShowForm] = useState(false); // 상품 등록 폼 표시 상태

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

  const sortedItems = items.sort((a, b) => {
    if (orderBy === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (orderBy === "favorite") {
      return b.favoriteCount - a.favoriteCount;
    }
    return 0;
  });

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleCreateProduct = async (productData) => {
    const newProduct = await createProduct(productData);
    if (newProduct) {
      setItems((prevItems) => [newProduct, ...prevItems]);
      setShowForm(false);
    }
  };

  return (
    <div className="ProductListForm">
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
                  initialCount={
                    favoriteCounts[product.id] || product.favoriteCount
                  }
                  onFavoriteToggle={onFavoriteToggle} // onFavoriteToggle 전달
                />
              </div>
            ))
          ) : (
            <p>상품이 없습니다.</p>
          )}
        </div>
      </div>

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
