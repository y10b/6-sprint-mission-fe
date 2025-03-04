import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // 빈 하트 아이콘 추가

const FavoriteButton = ({ productId, initialCount, onFavoriteToggle }) => {
  const [clicked, setClicked] = useState(false);
  const [count, setCount] = useState(initialCount);

  const toggleClick = () => {
    const newCount = clicked ? count - 1 : count + 1;
    setClicked(!clicked);
    setCount(newCount); // 로컬 상태 업데이트

    // 부모 컴포넌트로부터 전달된 함수 호출하여 서버에 좋아요 추가 요청
    onFavoriteToggle(productId, newCount);
  };

  return (
    <span className="favoriteCount">
      {clicked ? (
        <FaHeart
          className="favorite-icon"
          color="red" // 클릭 시 빨간색
          onClick={toggleClick}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <FaRegHeart
          className="favorite-icon"
          color="gray" // 기본 상태에서 빈 하트
          onClick={toggleClick}
          style={{ cursor: "pointer" }}
        />
      )}{" "}
      {count.toLocaleString()} {/* 숫자 포맷 적용 */}
    </span>
  );
};

export default FavoriteButton;
