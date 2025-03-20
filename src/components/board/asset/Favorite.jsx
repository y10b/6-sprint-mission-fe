import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // 빈 하트 아이콘과 채워진 하트 아이콘
import axios from "axios";
import { baseURL } from "../../../env";

const FavoriteButtonBoard = ({ articleId, initialCount, onFavoriteToggle }) => {
  const [isClicked, setIsClicked] = useState(false); // 기본값을 false로 설정
  const [count, setCount] = useState(initialCount || 0); // 좋아요 수, 초기값을 0으로 설정

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(`${baseURL}/articles/${articleId}`);

        const likes = Array.isArray(response.data.likes)
          ? response.data.likes
          : [];
        setCount(likes.length);
      } catch (error) {
        console.error("좋아요 수를 가져오는 데 오류 발생", error);
      }
    };

    fetchLikeCount();
  }, [articleId]); // `articleId`가 변경될 때마다 좋아요 수를 다시 가져옴

  const toggleClick = async () => {
    let newCount;

    // 클릭할 때마다 좋아요 수를 증가시키거나 감소시킨다
    if (isClicked) {
      newCount = count - 1; // 좋아요 취소 시
    } else {
      newCount = count + 1; // 좋아요 추가 시
    }

    // UI 상태 업데이트
    setIsClicked(!isClicked); // 클릭 상태 반전
    setCount(newCount); // 새로운 `count` 값으로 업데이트

    try {
      // 서버에 좋아요 증감 요청 (like API 사용)
      const response = await axios.post(
        `${baseURL}/articles/${articleId}/like`,
        {
          // 요청 본문에 필요한 데이터 추가 (예: 사용자 ID나 토큰 등)
          userId: "사용자ID", // 예시로 사용자 ID를 보낼 경우
        }
      );

      if (response.status === 200) {
        // 서버에서 변경된 좋아요 수로 업데이트된 데이터 반환
        setCount(response.data.favoriteCount); // 서버에서 반환된 좋아요 수로 업데이트
        onFavoriteToggle(articleId, response.data.favoriteCount);
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
      {count >= 0 ? count.toLocaleString() : 0}{" "}
      {/* 숫자 포맷 적용, count가 0 이상이면 표시, 아니면 0 */}
    </span>
  );
};

export default FavoriteButtonBoard;
