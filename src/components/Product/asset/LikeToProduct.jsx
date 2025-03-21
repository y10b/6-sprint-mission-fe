import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // 빈 하트 아이콘과 채워진 하트 아이콘
import axios from "axios";
import { baseURL } from "../../../env";

const LikeToProduct = ({
  productId,
  initialCount,
  onLikeToggle,
  onLikeRemove,
}) => {
  const [isClicked, setIsClicked] = useState(false); // 기본값을 false로 설정
  const [count, setCount] = useState(initialCount || 0); // 좋아요 수, 초기값을 0으로 설정

  // 초기 상태 설정
  useEffect(() => {
    setCount(initialCount || 0); // 좋아요 수 초기화
  }, [initialCount]);

  const toggleClick = async () => {
    const newCount = isClicked ? count - 1 : count + 1; // 클릭 시 상태 변경

    setIsClicked(!isClicked); // 클릭 상태 반전
    setCount(newCount); // 새로운 `count` 값으로 업데이트

    try {
      let response;

      if (isClicked) {
        // 좋아요 취소 API 호출
        response = await axios.delete(`${baseURL}/products/${productId}/like`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setCount(response.data.likeCount || newCount); // 서버에서 실제 좋아요 수 받아오기
          onLikeRemove(productId, newCount); // 부모 컴포넌트로 좋아요 취소 상태 전달
        }
      } else {
        // 좋아요 추가 API 호출
        response = await axios.post(
          `${baseURL}/products/${productId}/like`,
          {},
          {
            withCredentials: true,
          }
        );

        if (response.status === 201) {
          setCount(response.data.likeCount || newCount); // 서버에서 실제 좋아요 수 받아오기
          onLikeToggle(productId, newCount); // 부모 컴포넌트로 좋아요 상태 전달
        }
      }
    } catch (err) {
      console.error("좋아요 업데이트 오류:", err);
      setIsClicked(!isClicked); // 실패 시 클릭 상태 원상 복귀
      setCount(count); // 원래 상태로 복원
    }
  };

  return (
    <span className="likeCount">
      {isClicked ? (
        <FaHeart
          className="like-icon"
          color="red" // 클릭 시 빨간색
          onClick={toggleClick}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <FaRegHeart
          className="like-icon"
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

export default LikeToProduct;
