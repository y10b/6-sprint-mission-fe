import React, { useState, useCallback, memo, useMemo, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useToggleProductLike } from "@/lib/react-query";
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

    // React Query mutation 훅 사용
    const toggleLikeMutation = useToggleProductLike();
    const isLoading = toggleLikeMutation.isPending;

    // props 변경 시 상태 업데이트 (캐시 무효화로 인한 props 변경 반영)
    useEffect(() => {
      setIsClicked(initialIsFavorite);
      setCount(initialCount);
    }, [initialIsFavorite, initialCount]);

    // 타입 가드 함수 추가
    const hasFavoriteCount = (data: any): data is { favoriteCount: number } => {
      return data && typeof data.favoriteCount === "number";
    };

    // 좋아요 토글 핸들러를 useCallback으로 메모이제이션
    const handleToggle = useCallback(async () => {
      if (isLoading) return; // 중복 요청 방지

      const prevClicked = isClicked;
      const prevCount = count;

      // 낙관적 업데이트 (Optimistic Update)
      setIsClicked(!prevClicked);
      setCount(prevClicked ? prevCount - 1 : prevCount + 1);

      try {
        // React Query mutation 사용
        const data = await toggleLikeMutation.mutateAsync({
          productId,
          isCurrentlyLiked: prevClicked,
        });

        // 서버 응답에 따른 최종 상태 업데이트
        const newCount = hasFavoriteCount(data)
          ? data.favoriteCount
          : prevClicked
          ? Math.max(0, prevCount - 1)
          : prevCount + 1;

        setIsClicked(!prevClicked);
        setCount(newCount);

        // 콜백 호출
        if (prevClicked) {
          onLikeRemove?.(productId, newCount);
        } else {
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
              const data = await toggleLikeMutation.mutateAsync({
                productId,
                isCurrentlyLiked: true, // 강제로 제거
              });
              const newCount = hasFavoriteCount(data)
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
      }
    }, [
      isClicked,
      count,
      isLoading,
      productId,
      onLikeToggle,
      onLikeRemove,
      toggleLikeMutation,
    ]);

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
