import React, { useState, useCallback, memo, useMemo } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { addFavorite, removeFavorite } from "@/lib/api/products/favorite";
import { logger } from "@/utils/logger";
import { TId } from "@/types";

interface ILikeToProductProps {
  productId: TId;
  initialCount?: number;
  initialIsFavorite?: boolean;
  onLikeToggle?: (productId: TId, count: number) => void;
  onLikeRemove?: (productId: TId, count: number) => void;
}

/**
 * 최적화된 상품 좋아요 컴포넌트
 * - useCallback으로 핸들러 함수 메모이제이션
 * - useMemo로 계산된 값 메모이제이션
 * - React.memo로 불필요한 리렌더링 방지
 */
const LikeToProduct = memo(
  ({
    productId,
    initialCount = 0,
    initialIsFavorite = false,
    onLikeToggle,
    onLikeRemove,
  }: ILikeToProductProps) => {
    const [isClicked, setIsClicked] = useState(initialIsFavorite);
    const [count, setCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);

    // 좋아요 토글 핸들러를 useCallback으로 메모이제이션
    const handleToggle = useCallback(async () => {
      if (isLoading) return; // 중복 요청 방지

      const prevClicked = isClicked;
      const prevCount = count;

      // 낙관적 업데이트 (Optimistic Update)
      setIsClicked(!prevClicked);
      setCount(prevClicked ? prevCount - 1 : prevCount + 1);
      setIsLoading(true);

      try {
        let data;
        if (prevClicked) {
          // 좋아요 삭제
          data = await removeFavorite(productId);
          // 서버 응답이 빈 객체인 경우를 대비한 안전한 처리
          const newCount =
            data && typeof data.favoriteCount === "number"
              ? data.favoriteCount
              : Math.max(0, prevCount - 1);
          setIsClicked(false);
          setCount(newCount);
          onLikeRemove?.(productId, newCount);
        } else {
          // 좋아요 추가
          data = await addFavorite(productId);
          // 서버 응답이 빈 객체인 경우를 대비한 안전한 처리
          const newCount =
            data && typeof data.favoriteCount === "number"
              ? data.favoriteCount
              : prevCount + 1;
          setIsClicked(true);
          setCount(newCount);
          onLikeToggle?.(productId, newCount);
        }
      } catch (error) {
        // 에러 발생 시 이전 상태로 롤백
        setIsClicked(prevClicked);
        setCount(prevCount);

        if (error instanceof Error) {
          const message = error.message;

          if (message.includes("이미 찜한 상품")) {
            logger.warn("이미 찜한 상품이므로 좋아요를 취소합니다.");
            try {
              const data = await removeFavorite(productId);
              const newCount =
                data && typeof data.favoriteCount === "number"
                  ? data.favoriteCount
                  : Math.max(0, prevCount - 1);
              setIsClicked(false);
              setCount(newCount);
              onLikeRemove?.(productId, newCount);
            } catch (removeError) {
              logger.error("좋아요 취소도 실패", removeError);
            }
          } else {
            logger.error("좋아요 처리 실패", error);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }, [isClicked, count, isLoading, productId, onLikeToggle, onLikeRemove]);

    // 포맷된 카운트를 useMemo로 메모이제이션
    const formattedCount = useMemo(() => {
      return count.toLocaleString();
    }, [count]);

    // 하트 아이콘을 useMemo로 메모이제이션
    const HeartIcon = useMemo(() => {
      const IconComponent = isClicked ? FaHeart : FaRegHeart;
      const iconClassName = `cursor-pointer mr-2 transition-colors duration-200 ${
        isLoading ? "opacity-50" : ""
      } ${
        isClicked
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-gray-500"
      }`;

      return (
        <IconComponent
          className={iconClassName}
          onClick={handleToggle}
          size={20}
          aria-label={isClicked ? "좋아요 취소" : "좋아요"}
        />
      );
    }, [isClicked, isLoading, handleToggle]);

    // 컨테이너 클래스명 메모이제이션
    const containerClassName = useMemo(
      () => "flex items-center font-semibold text-gray-500 text-base gap-1.5",
      []
    );

    return (
      <span className={containerClassName}>
        {HeartIcon}
        <span aria-live="polite">{formattedCount}</span>
      </span>
    );
  }
);

LikeToProduct.displayName = "LikeToProduct";

export default LikeToProduct;
