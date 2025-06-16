"use client";

import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface LikeToArticleProps {
  articleId: number;
  initialCount: number;
  onLikeToggle?: (articleId: number, count: number) => void;
}

const LikeToArticle = ({
  articleId,
  initialCount = 0,
  onLikeToggle,
}: LikeToArticleProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/articles/${articleId}`
        );
        if (!response.ok) {
          throw new Error("좋아요 수를 가져오는데 실패했습니다.");
        }
        const data = await response.json();
        const likesCount = data.likesCount || 0;
        setCount(likesCount);
      } catch (error) {
        console.error("좋아요 수 조회 실패:", error);
      }
    };

    fetchLikeCount();
  }, [articleId]);

  const toggleClick = async () => {
    const newCount = isClicked ? count - 1 : count + 1;

    setIsClicked(!isClicked);
    setCount(newCount);

    try {
      const response = await fetch(
        `http://localhost:5000/articles/${articleId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("좋아요 토글에 실패했습니다.");
      }

      const data = await response.json();
      const updatedCount = data.likesCount || newCount;
      setCount(updatedCount);

      if (onLikeToggle) {
        onLikeToggle(articleId, updatedCount);
      }
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      setIsClicked(!isClicked);
      setCount(count); // 되돌리기
    }
  };

  return (
    <div className="flex items-center space-x-1 text-gray-700 text-sm">
      {isClicked ? (
        <FaHeart
          className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
          size={18}
          onClick={toggleClick}
        />
      ) : (
        <FaRegHeart
          className="text-gray-400 cursor-pointer hover:scale-110 transition-transform"
          size={18}
          onClick={toggleClick}
        />
      )}
      <span className="font-medium">
        {count >= 0 ? count.toLocaleString() : 0}
      </span>
    </div>
  );
};

export default LikeToArticle;
