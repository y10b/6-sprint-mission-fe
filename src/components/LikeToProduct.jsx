import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toggleFavorite } from "@/features/products/services/favorite"; // 경로는 네 프로젝트에 맞게 수정

export default function LikeToProduct({
  productId,
  initialCount = 0,
  initialIsFavorite = false,
  onLikeToggle,
  onLikeRemove,
}) {
  const [isClicked, setIsClicked] = useState(initialIsFavorite);
  const [count, setCount] = useState(initialCount);

  const handleToggle = async () => {
    const prevClicked = isClicked;
    const prevCount = count;

    setIsClicked(!prevClicked);
    setCount(prevClicked ? prevCount - 1 : prevCount + 1);

    try {
      const data = await toggleFavorite(productId, prevClicked);

      setIsClicked(data.isFavorite ?? !prevClicked);
      setCount(
        data.favoriteCount ?? (prevClicked ? prevCount - 1 : prevCount + 1)
      );

      if (prevClicked) {
        onLikeRemove?.(productId, data.favoriteCount);
      } else {
        onLikeToggle?.(productId, data.favoriteCount);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      setIsClicked(prevClicked);
      setCount(prevCount);
    }
  };

  return (
    <span className="flex items-center font-semibold text-gray-500 text-base gap-1.5">
      {isClicked ? (
        <FaHeart
          className="cursor-pointer mr-2 text-red-500"
          onClick={handleToggle}
          size={20}
        />
      ) : (
        <FaRegHeart
          className="cursor-pointer mr-2 text-gray-400"
          onClick={handleToggle}
          size={20}
        />
      )}
      {count.toLocaleString()}
    </span>
  );
}
