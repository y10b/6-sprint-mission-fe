"use client";

import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";

const LikeToArticle = ({ articleId, initialCount, onLikeToggle }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [count, setCount] = useState(initialCount || 0);

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/articles/${articleId}`
        );
        const likesCount = response.data.likesCount || 0;
        setCount(likesCount);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLikeCount();
  }, [articleId]);

  const toggleClick = async () => {
    const newCount = isClicked ? count - 1 : count + 1;

    setIsClicked(!isClicked);
    setCount(newCount);

    try {
      const response = await axios.post(
        `http://localhost:5000/articles/${articleId}/like`
      );

      if (response.status === 200) {
        const updatedCount = response.data.likesCount || newCount;
        setCount(updatedCount);
        if (onLikeToggle) {
          onLikeToggle(articleId, updatedCount);
        }
      }
    } catch (error) {
      console.error(error);
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
