import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import BestProducts from './components/Product/BestProducts';
import ProductList from './components/Product/ProductList';
import { getProductList } from './components/Product/Products';
import { addFavorite, removeFavorite } from './components/Product/FavoriteAPI';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';


import './JSstyle.css';

const App = () => {
  const [page, setPage] = useState(1); // 페이지 상태
  const [pageSize] = useState(10);
  const [orderBy, setOrderBy] = useState('recent');
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]); // 상품 목록
  const [hasNext, setHasNext] = useState(false); // 다음 페이지 여부
  const [favoriteCounts, setFavoriteCounts] = useState({}); // 각 상품의 favoriteCount 상태

  // 상품 목록을 가져오는 useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProductList(page, pageSize, orderBy, keyword);
      if (data) {
        setProducts(data.list); // 상품 목록 업데이트
        setHasNext(data.totalCount > page * pageSize); // 다음 페이지 여부

        // 각 상품의 favoriteCount 초기화
        const initialCounts = data.list.reduce((acc, product) => {
          acc[product.id] = product.favoriteCount;
          return acc;
        }, {});
        setFavoriteCounts(initialCounts);
      }
    };
    fetchProducts();
  }, [page, pageSize, orderBy, keyword]);

  // 좋아요 클릭 시 카운트 업데이트
  const handleFavoriteToggle = async (productId, currentCount) => {
    try {
      const newFavoriteCount = currentCount + 1;
      const success = await addFavorite(productId); // 좋아요 추가 API 요청
      if (success) {
        setFavoriteCounts((prevCounts) => ({
          ...prevCounts,
          [productId]: newFavoriteCount,
        }));
      }
    } catch (error) {
      console.error('좋아요 추가 실패:', error);
    }
  };

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/market"
          element={
            <div>
              {/* 베스트 상품 */}
              <BestProducts favoriteCounts={favoriteCounts} onFavoriteToggle={handleFavoriteToggle} />

              {/* 상품 목록 */}
              <ProductList
                products={products}
                keyword={keyword}
                setKeyword={setKeyword}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                page={page}
                setPage={setPage}
                hasNext={hasNext}
                favoriteCounts={favoriteCounts}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
