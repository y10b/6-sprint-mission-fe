import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { addFavorite, removeFavorite } from "@/lib/api/products/favorite";

interface LikeToProductProps {
  productId: number;
  initialCount?: number;
  initialIsFavorite?: boolean;
  onLikeToggle?: (productId: number, count: number) => void;
  onLikeRemove?: (productId: number, count: number) => void;
}

export default function LikeToProduct({
  productId,
  initialCount = 0,
  initialIsFavorite = false,
  onLikeToggle,
  onLikeRemove,
}: LikeToProductProps) {
  const [isClicked, setIsClicked] = useState(initialIsFavorite);
  const [count, setCount] = useState(initialCount);

  const handleToggle = async () => {
    const prevClicked = isClicked;
    const prevCount = count;

    setIsClicked(!prevClicked);
    setCount(prevClicked ? prevCount - 1 : prevCount + 1);

    try {
      let data;
      if (prevClicked) {
        // 좋아요 삭제
        data = await removeFavorite(productId);
        setIsClicked(false);
        setCount(data.favoriteCount ?? prevCount - 1);
        onLikeRemove?.(productId, data.favoriteCount);
      } else {
        // 좋아요 추가
        data = await addFavorite(productId);
        setIsClicked(true);
        setCount(data.favoriteCount ?? prevCount + 1);
        onLikeToggle?.(productId, data.favoriteCount);
      }
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;

        if (message.includes("이미 찜한 상품")) {
          console.warn("이미 찜한 상품이므로 좋아요를 취소합니다.");
          try {
            const data = await removeFavorite(productId); // 바로 취소 처리 시도
            setIsClicked(false);
            setCount(data.favoriteCount ?? prevCount - 1);
            onLikeRemove?.(productId, data.favoriteCount);
            return;
          } catch (e) {
            console.error("좋아요 취소도 실패함:", e);
          }
        }

        console.error("좋아요 처리 실패:", error);
      }
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
