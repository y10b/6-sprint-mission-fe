import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.js";
import ProductList from "./components/Product/ProductList.jsx";
import CreateProduct from "./components/Product/CreateProduct.jsx"; // CreateProduct 임포트

import "./JSstyle.css";
import NotFound from "./components/NotFound/NotFound.js";

const App = () => {
  const [orderBy, setOrderBy] = useState("recent");
  const [keyword, setKeyword] = useState("");

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
        <Route path="/registration" element={<CreateProduct />} /> {/* 상품 등록 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
