import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // 빈 하트 아이콘 추가

const FavoriteButton = ({ productId, initialCount }) => {
  const [clicked, setClicked] = useState(false);
  const [count, setCount] = useState(initialCount);

  const toggleClick = () => {
    setClicked(!clicked);
    setCount((prev) => (clicked ? prev - 1 : prev + 1)); // 토글 시 +1 / -1
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
