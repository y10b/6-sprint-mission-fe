import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.jsx";
import ProductList from "./components/Product/ProductList.jsx";
import CreateProduct from "./components/Product/CreateProduct.jsx"; // CreateProduct 임포트

import "./color.css";
import NotFound from "./components/NotFound/NotFound.jsx";
import BoardGeneral from "./components/board/BoradGeneral.jsx";
import BoardCreateForm from "./components/board/BoardCreateForm.jsx";

const App = () => {
  const [orderBy, setOrderBy] = useState("recent");
  const [keyword, setKeyword] = useState("");

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* 상품 목록 페이지 */}
        <Route
          path="/items"
          element={
            <div>
              <ProductList
                keyword={keyword}
                setKeyword={setKeyword}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
              />
            </div>
          }
        />

        {/* 상품 등록 페이지 */}
        <Route path="/registration" element={<CreateProduct />} />
        {/* 자유게시판 */}
        <Route path="/boardGeneral" element={<BoardGeneral />} />
        {/* 게시글 생성 */}
        <Route path="/boardCreate" element={<BoardCreateForm />} />
        {/* 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes >
    </div >
  );
};

export default App;
