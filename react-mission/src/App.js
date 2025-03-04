import React, { useState, useEffect } from "react";
import BestProducts from "./components/Product/BestProducts";
import ProductList from "./components/Product/ProductList";
import { getProductList } from "./components/Product/Products"; // 상품 목록을 가져오는 함수

import "./JSstyle.css";

const App = () => {
  const [page, setPage] = useState(1); // 페이지 상태 정의
  const [pageSize] = useState(10);
  const [orderBy, setOrderBy] = useState("recent");
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]); // 상품 목록
  const [hasNext, setHasNext] = useState(false); // 다음 페이지 여부

  // 상품 목록을 fetch하는 useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProductList(page, pageSize, orderBy, keyword);
      if (data) {
        setProducts(data.list); // 상품 목록 업데이트
        setHasNext(data.totalCount > page * pageSize); // 다음 페이지 존재 여부
      }
    };
    fetchProducts();
  }, [page, pageSize, orderBy, keyword]); // page, pageSize, orderBy, keyword가 변경될 때마다 실행

  return (
    <div>
      {/* 베스트 상품 */}
      <BestProducts />

      {/* 상품 목록 */}
      <ProductList
        products={products}
        keyword={keyword}
        setKeyword={setKeyword}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        page={page} // 페이지 상태 전달
        setPage={setPage} // 페이지 변경을 위한 setPage 전달
        hasNext={hasNext} // 다음 페이지 존재 여부 전달
      />
    </div>
  );
};

export default App;
