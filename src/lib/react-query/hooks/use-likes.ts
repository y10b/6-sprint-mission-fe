import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "@/lib/api/products/favorite";
import {
  createMutationOptions,
  queryKeys,
  invalidationTargets,
} from "../query-options";
import { TId } from "@/types";
import { logger } from "@/utils/logger";

/**
 * 상품 좋아요 관련 React Query 훅들
 */

// =============================================================================
// Mutation 훅들
// =============================================================================

/**
 * 상품 좋아요 토글
 */
export function useToggleProductLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      isCurrentlyLiked,
    }: {
      productId: TId;
      isCurrentlyLiked: boolean;
    }) => {
      if (isCurrentlyLiked) {
        return await removeFavorite(productId);
      } else {
        return await addFavorite(productId);
      }
    },
    ...createMutationOptions<
      any,
      Error,
      { productId: TId; isCurrentlyLiked: boolean }
    >({
      onSuccess: (data, { productId, isCurrentlyLiked }) => {
        // 좋아요 토글 시 무효화할 쿼리들
        invalidationTargets
          .onLikeToggle("product", productId)
          .forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey });
          });

        // 상품 목록도 무효화 (좋아요 개수 업데이트를 위해)
        queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      },
      onError: (error, { productId, isCurrentlyLiked }) => {
        logger.error("좋아요 토글 실패:", error);
      },
    }),
  });
}

/**
 * 상품 좋아요 추가
 */
export function useAddProductLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: TId) => addFavorite(productId),
    ...createMutationOptions<any, Error, TId>({
      onSuccess: (data, productId) => {
        // 관련 캐시 무효화
        invalidationTargets
          .onLikeToggle("product", productId)
          .forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey });
          });
        queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      },
    }),
  });
}

/**
 * 상품 좋아요 제거
 */
export function useRemoveProductLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: TId) => removeFavorite(productId),
    ...createMutationOptions<any, Error, TId>({
      onSuccess: (data, productId) => {
        // 관련 캐시 무효화
        invalidationTargets
          .onLikeToggle("product", productId)
          .forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey });
          });
        queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      },
    }),
  });
}
