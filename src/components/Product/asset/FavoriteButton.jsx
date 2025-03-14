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
    let newCount;

    // 클릭할 때마다 좋아요 수를 증가시키거나 감소시킨다
    if (clicked) {
      // 이미 클릭되었으면 좋아요 수를 감소시킨다
      newCount = count - 1;
    } else {
      // 처음 클릭되었으면 좋아요 수를 증가시킨다
      newCount = count + 1;
    }

    // UI 상태 업데이트
    setClicked(!clicked); // 클릭 상태 반전
    setCount(newCount); // 새로운 `count` 값으로 업데이트

    try {
      // 서버에 좋아요 증감 요청
      const response = await axios.post(
        `http://localhost:3002/api/items/${productId}/${
          clicked ? "decreaseFavorite" : "increaseFavorite"
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
