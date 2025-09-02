"use client";

import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  getArticleWithLikes,
  toggleArticleLike,
} from "@/lib/api/articles/articlesApi";
import { logger } from "@/utils/logger";

interface ILikeToArticleProps {
  articleId: number;
  initialCount: number;
  onLikeToggle?: (articleId: number, count: number) => void;
}

const LikeToArticle = ({
  articleId,
  initialCount = 0,
  onLikeToggle,
}: ILikeToArticleProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const data = await getArticleWithLikes(articleId);
        setCount(data.likeCount);
        setIsClicked(data.isLiked);
      } catch (error) {
        logger.error("좋아요 수 조회 실패:", error);
      }
    };

    fetchLikeCount();
  }, [articleId]);

  const handleToggleClick = async () => {
    try {
      const data = await toggleArticleLike(articleId);
      setIsClicked(data.liked);

      // 좋아요 상태에 따라 카운트 업데이트
      const newCount = data.liked ? count + 1 : count - 1;
      setCount(newCount);

      if (onLikeToggle) {
        onLikeToggle(articleId, newCount);
      }
    } catch (error) {
      logger.error("좋아요 토글 실패:", error);
    }
  };

  return (
    <button
      onClick={handleToggleClick}
      className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
    >
      {isClicked ? (
        <AiFillHeart className="w-5 h-5 text-red-500" />
      ) : (
        <AiOutlineHeart className="w-5 h-5" />
      )}
      <span>{count}</span>
    </button>
  );
};

export default LikeToArticle;
