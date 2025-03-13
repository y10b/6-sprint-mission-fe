import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // 빈 하트 아이콘 추가
import axios from "axios";

const FavoriteButton = ({ productId, initialCount, onFavoriteToggle }) => {
  const [clicked, setClicked] = useState(initialCount > 0); // 초기 상태를 `initialCount > 0`에 맞춰 설정
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setClicked(initialCount > 0); // 부모 컴포넌트에서 `initialCount`가 변경될 때 `clicked` 상태도 갱신
    setCount(initialCount); // `count` 값도 초기화
  }, [initialCount]);

  const toggleClick = async () => {
    const newCount = clicked ? count - 1 : count + 1;
    setClicked(!clicked); // `clicked` 상태를 반전시킴
    setCount(newCount); // 새로운 `count` 값으로 업데이트

    // 부모 컴포넌트로부터 전달된 함수 호출하여 서버에 좋아요 추가 요청
    try {
      // 서버에 좋아요 증가 요청
      await axios.post(
        `http://localhost:3002/api/items/${productId}/increaseFavorite`,
        {}
      );

      // onFavoriteToggle을 통해 부모 컴포넌트에서 상태 업데이트
      onFavoriteToggle(productId, newCount);
    } catch (error) {
      console.error("좋아요 업데이트 오류", error);
      // 실패 시 클릭 상태 및 카운트 초기화
      setClicked(!clicked);
      setCount(count); // 원래 상태로 복원
    }
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
      )}
      {count.toLocaleString()} {/* 숫자 포맷 적용 */}
    </span>
  );
};

export default FavoriteButton;
