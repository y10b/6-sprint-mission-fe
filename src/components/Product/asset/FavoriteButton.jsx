import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // 빈 하트 아이콘과 채워진 하트 아이콘
import axios from "axios";
import "./css/FavoriteButton.css";

const FavoriteButton = ({ productId, initialCount, onFavoriteToggle }) => {
  const [isClicked, setIsClicked] = useState(false); // 기본값을 false로 설정
  const [count, setCount] = useState(initialCount); // 좋아요 수

  useEffect(() => {
    setCount(initialCount); // 부모 컴포넌트에서 전달된 초기 좋아요 수로 초기화
  }, [initialCount]);

  const toggleClick = async () => {
    let newCount;

    // 클릭할 때마다 좋아요 수를 증가시키거나 감소시킨다
    if (isClicked) {
      // 이미 클릭되었으면 좋아요 수를 감소시킨다
      newCount = count - 1;
    } else {
      // 처음 클릭되었으면 좋아요 수를 증가시킨다
      newCount = count + 1;
    }

    // UI 상태 업데이트
    setIsClicked(!isClicked); // 클릭 상태 반전
    setCount(newCount); // 새로운 `count` 값으로 업데이트

    try {
      // 서버에 좋아요 증감 요청
      const response = await axios.post(
        `http://localhost:3002/api/items/${productId}/${
          isClicked ? "decreaseFavorite" : "increaseFavorite"
        }`,
        {}
      );

      // 서버에서 변경된 좋아요 수로 업데이트된 데이터 반환
      if (response.status === 200) {
        // 부모 컴포넌트로부터 전달된 함수 호출하여 서버에 좋아요 추가 요청
        onFavoriteToggle(productId, response.data.favoriteCount);
      }
    } catch (error) {
      console.error("좋아요 업데이트 오류", error);
      // 실패 시 클릭 상태 및 카운트 초기화
      setIsClicked(!isClicked);
      setCount(count); // 원래 상태로 복원
    }
  };

  return (
    <span className="favoriteCount">
      {isClicked ? (
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
