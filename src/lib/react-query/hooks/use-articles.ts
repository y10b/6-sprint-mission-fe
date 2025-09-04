import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IArticle,
  ICreateArticleInput,
  TUpdateArticleInput,
  TId,
} from "@/types";
import {
  queryKeys,
  createQueryOptions,
  createMutationOptions,
  invalidationTargets,
  DEFAULT_QUERY_OPTIONS,
  REAL_TIME_QUERY_OPTIONS,
} from "../query-options";
import * as articlesApi from "../../api/articles/articlesApi";

/**
 * 게시글 관련 React Query 훅들
 */

// =============================================================================
// Query 훅들
// =============================================================================

/**
 * 게시글 목록 조회
 */
export function useArticles(
  filters: {
    page?: number;
    limit?: number;
    sort?: string;
    keyword?: string;
  } = {}
) {
  return useQuery({
    queryKey: queryKeys.articles.list(filters),
    queryFn: () => articlesApi.fetchArticlesFromAPI(filters),
    ...createQueryOptions<{ articles: IArticle[]; totalCount: number }>({
      ...DEFAULT_QUERY_OPTIONS,
      // 게시글은 자주 업데이트되므로 staleTime을 짧게
      staleTime: 1 * 60 * 1000, // 1분
    }),
  });
}

/**
 * 게시글 상세 조회
 */
export function useArticle(articleId: TId, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.articles.detail(articleId),
    queryFn: () => articlesApi.getArticle(articleId),
    ...createQueryOptions<IArticle>({
      ...DEFAULT_QUERY_OPTIONS,
      enabled: enabled && !!articleId,
    }),
  });
}

/**
 * 게시글 좋아요 정보 조회
 */
export function useArticleLikes(articleId: TId, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.articles.likes(articleId),
    queryFn: () => articlesApi.getArticleWithLikes(articleId),
    ...createQueryOptions<{ likeCount: number; isLiked: boolean }>({
      ...REAL_TIME_QUERY_OPTIONS,
      enabled: enabled && !!articleId,
    }),
  });
}

/**
 * 전체 게시글 목록 (간단한 형태)
 */
export function useAllArticles() {
  return useQuery({
    queryKey: queryKeys.articles.all,
    queryFn: () => articlesApi.getArticles(),
    ...createQueryOptions<IArticle[]>({
      ...DEFAULT_QUERY_OPTIONS,
    }),
  });
}

// =============================================================================
// Mutation 훅들
// =============================================================================

/**
 * 게시글 생성
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateArticleInput) => articlesApi.createArticle(data),
    ...createMutationOptions<IArticle, Error, ICreateArticleInput>({
      onSuccess: (newArticle) => {
        // 게시글 목록 무효화
        invalidationTargets.onArticleChange.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });

        // 새 게시글을 캐시에 추가
        queryClient.setQueryData(
          queryKeys.articles.detail(newArticle.id),
          newArticle
        );
      },
    }),
  });
}

/**
 * 게시글 수정
 */
export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      articleId,
      data,
    }: {
      articleId: TId;
      data: TUpdateArticleInput;
    }) => articlesApi.updateArticle(articleId, data),
    ...createMutationOptions<
      IArticle,
      Error,
      { articleId: TId; data: TUpdateArticleInput }
    >({
      onSuccess: (updatedArticle, { articleId }) => {
        // 수정된 게시글 캐시 업데이트
        queryClient.setQueryData(
          queryKeys.articles.detail(articleId),
          updatedArticle
        );

        // 게시글 목록 무효화
        invalidationTargets.onArticleChange.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      },
    }),
  });
}

/**
 * 게시글 삭제
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: TId) => articlesApi.deleteArticle(articleId),
    ...createMutationOptions<void, Error, TId>({
      onSuccess: (_, articleId) => {
        // 삭제된 게시글 캐시에서 제거
        queryClient.removeQueries({
          queryKey: queryKeys.articles.detail(articleId),
        });

        // 관련 쿼리들 무효화
        invalidationTargets.onArticleChange.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      },
    }),
  });
}

/**
 * 게시글 좋아요 토글
 */
export function useToggleArticleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: TId) => articlesApi.toggleArticleLike(articleId),
    ...createMutationOptions<{ liked: boolean }, Error, TId>({
      onMutate: async (articleId) => {
        // 옵티미스틱 업데이트를 위해 이전 데이터 백업
        await queryClient.cancelQueries({
          queryKey: queryKeys.articles.likes(articleId),
        });

        const previousLikes = queryClient.getQueryData(
          queryKeys.articles.likes(articleId)
        ) as { likeCount: number; isLiked: boolean } | undefined;

        // 옵티미스틱 업데이트
        if (previousLikes) {
          queryClient.setQueryData(queryKeys.articles.likes(articleId), {
            likeCount: previousLikes.isLiked
              ? previousLikes.likeCount - 1
              : previousLikes.likeCount + 1,
            isLiked: !previousLikes.isLiked,
          });
        }

        return { previousLikes };
      },
      onError: (_, articleId, context) => {
        // 에러 발생 시 이전 데이터로 롤백
        if (context?.previousLikes) {
          queryClient.setQueryData(
            queryKeys.articles.likes(articleId),
            context.previousLikes
          );
        }
      },
      onSettled: (_, __, articleId) => {
        // 최종적으로 서버 데이터로 동기화
        queryClient.invalidateQueries({
          queryKey: queryKeys.articles.likes(articleId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.articles.detail(articleId),
        });
      },
    }),
  });
}

// =============================================================================
// 유틸리티 훅들
// =============================================================================

/**
 * 게시글 prefetch
 */
export function usePrefetchArticle() {
  const queryClient = useQueryClient();

  return (articleId: TId) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.articles.detail(articleId),
      queryFn: () => articlesApi.getArticle(articleId),
      ...DEFAULT_QUERY_OPTIONS,
    });
  };
}

/**
 * 게시글 캐시 무효화
 */
export function useInvalidateArticles() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.lists() });
    },
    invalidateDetail: (articleId: TId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.articles.detail(articleId),
      });
    },
    invalidateLikes: (articleId: TId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.articles.likes(articleId),
      });
    },
  };
}




