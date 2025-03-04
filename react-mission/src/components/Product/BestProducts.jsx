import React, { useState, useEffect } from "react";
import { getProductList } from "./Products"; // API 호출 함수
import FavoriteButton from "./FavoriteButton"; // 좋아요 버튼 임포트
import { formatNumber } from "./utils"; // 숫자 포맷 함수 임포트

const BestProducts = ({ favoriteCounts, onFavoriteToggle }) => {
  const [bestProducts, setBestProducts] = useState([]);

  useEffect(() => {
    const fetchBestProducts = async () => {
      const data = await getProductList(1, 4, "favorite", "");
      if (data) {
        setBestProducts(data.list);
      }
    };
    fetchBestProducts();
  }, []);

  return (
    <div>
      <h2 className="bestproduct-text">베스트 상품</h2>
      <div className="bestproducts">
        {bestProducts.length > 0 ? (
          bestProducts.map((product) => (
            <div key={product.id} className="bestproduct-item">
              <img
                src={product.images[0]}
                className="bestproducts-img"
                alt={product.name}
              />
              <h3 className="name">{product.name}</h3>
              <p className="price">{formatNumber(product.price)}원</p>
              {/* FavoriteButton에 favoriteCounts와 onFavoriteToggle 전달 */}
              <FavoriteButton
                productId={product.id}
                initialCount={
                  favoriteCounts[product.id] || product.favoriteCount
                }
                onFavoriteToggle={onFavoriteToggle}
              />
            </div>
          ))
        ) : (
          <p>베스트 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default BestProducts;
