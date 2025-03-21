import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { baseURL } from "../../../env";

const LikeToArticle = ({ articleId, initialCount, onLikeToggle }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [count, setCount] = useState(initialCount || 0); // 좋아요 수, 초기값을 0으로 설정

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(`${baseURL}/articles/${articleId}`);
        const likesCount = response.data.likesCount || 0; // likesCount가 아닌 경우 0으로 처리
        setCount(likesCount);
      } catch (error) {
        console.error("좋아요 수를 가져오는 데 오류 발생", error);
      }
    };

    fetchLikeCount();
  }, [articleId]);

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
      // `userId` 없이 좋아요 증감 요청
      const response = await axios.post(
        `${baseURL}/articles/${articleId}/like`
      );

      if (response.status === 200) {
        // 서버에서 변경된 좋아요 수로 업데이트된 데이터 반환
        const updatedCount = response.data.likesCount || newCount; // 서버에서 반환된 좋아요 수로 업데이트
        setCount(updatedCount); // 서버에서 반환된 좋아요 수로 업데이트
        if (onLikeToggle) {
          onLikeToggle(articleId, updatedCount); // `onLikeToggle`이 정의되어 있으면 호출
        }
      }
    } catch (error) {
      console.error("좋아요 업데이트 오류", error);
      // 실패 시 클릭 상태 및 카운트 초기화
      setIsClicked(!isClicked);
      setCount(count); // 원래 상태로 복원
    }
  };

  return (
    <span className="likeCount">
      {isClicked ? (
        <FaHeart
          className="like-icon"
          color="red"
          onClick={toggleClick}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <FaRegHeart
          className="like-icon"
          color="gray"
          onClick={toggleClick}
          style={{ cursor: "pointer" }}
        />
      )}
      {count >= 0 ? count.toLocaleString() : 0}
    </span>
  );
};

export default LikeToArticle;
