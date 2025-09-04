import { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { IProduct, IArticle, IUser, TId } from "@/types";

/**
 * React Query 옵션 중앙 관리
 * 쿼리 키, 캐시 전략, 에러 처리를 통일합니다.
 */

// =============================================================================
// 기본 쿼리 옵션
// =============================================================================

export const DEFAULT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5분 - 데이터가 fresh한 시간
  gcTime: 10 * 60 * 1000, // 10분 - 캐시 유지 시간 (구 cacheTime)
  retry: 1, // 실패 시 재시도 횟수
  refetchOnWindowFocus: false, // 창 포커스 시 자동 refetch 비활성화
} as const;

export const REAL_TIME_QUERY_OPTIONS = {
  staleTime: 30 * 1000, // 30초 - 실시간성이 중요한 데이터
  gcTime: 2 * 60 * 1000, // 2분
  retry: 1,
  refetchOnWindowFocus: true,
} as const;

export const STATIC_QUERY_OPTIONS = {
  staleTime: 30 * 60 * 1000, // 30분 - 변경이 적은 데이터
  gcTime: 60 * 60 * 1000, // 1시간
  retry: 2,
  refetchOnWindowFocus: false,
} as const;

// =============================================================================
// 쿼리 키 팩토리 패턴
// =============================================================================

export const queryKeys = {
  // 사용자 관련
  users: {
    all: ["users"] as const,
    me: () => [...queryKeys.users.all, "me"] as const,
    byId: (id: TId) => [...queryKeys.users.all, "detail", id] as const,
  },

  // 상품 관련
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: TId) => [...queryKeys.products.details(), id] as const,
  },

  // 게시글 관련
  articles: {
    all: ["articles"] as const,
    lists: () => [...queryKeys.articles.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.articles.lists(), filters] as const,
    details: () => [...queryKeys.articles.all, "detail"] as const,
    detail: (id: TId) => [...queryKeys.articles.details(), id] as const,
    likes: (id: TId) => [...queryKeys.articles.detail(id), "likes"] as const,
  },

  // 댓글 관련
  comments: {
    all: ["comments"] as const,
    byProduct: (productId: TId) =>
      [...queryKeys.comments.all, "product", productId] as const,
    byArticle: (articleId: TId) =>
      [...queryKeys.comments.all, "article", articleId] as const,
  },

  // 좋아요/즐겨찾기 관련
  likes: {
    all: ["likes"] as const,
    products: () => [...queryKeys.likes.all, "products"] as const,
    articles: () => [...queryKeys.likes.all, "articles"] as const,
  },
} as const;

// =============================================================================
// 에러 처리 옵션
// =============================================================================

export const createQueryOptions = <TData, TError = Error>(
  options: Partial<UseQueryOptions<TData, TError>> = {}
): UseQueryOptions<TData, TError> => ({
  ...DEFAULT_QUERY_OPTIONS,
  ...options,
  onError: (error: TError) => {
    console.error("Query Error:", error);
    // 여기에 글로벌 에러 처리 로직 추가 가능
    options.onError?.(error);
  },
});

export const createMutationOptions = <TData, TError = Error, TVariables = void>(
  options: Partial<UseMutationOptions<TData, TError, TVariables>> = {}
): UseMutationOptions<TData, TError, TVariables> => ({
  ...options,
  onError: (error: TError) => {
    console.error("Mutation Error:", error);
    // 여기에 글로벌 에러 처리 로직 추가 가능
    options.onError?.(error);
  },
});

// =============================================================================
// 무효화 헬퍼
// =============================================================================

export const invalidationTargets = {
  // 상품 생성/수정/삭제 시 무효화할 쿼리들
  onProductChange: [
    queryKeys.products.all,
    queryKeys.products.lists(), // 모든 상품 목록 쿼리
  ],

  // 게시글 생성/수정/삭제 시 무효화할 쿼리들
  onArticleChange: [queryKeys.articles.all],

  // 댓글 생성/수정/삭제 시 무효화할 쿼리들
  onCommentChange: (productId?: TId, articleId?: TId) => [
    ...(productId ? [queryKeys.comments.byProduct(productId)] : []),
    ...(articleId ? [queryKeys.comments.byArticle(articleId)] : []),
    ...(productId ? [queryKeys.products.detail(productId)] : []),
    ...(articleId ? [queryKeys.articles.detail(articleId)] : []),
  ],

  // 좋아요 토글 시 무효화할 쿼리들
  onLikeToggle: (type: "product" | "article", id: TId) => [
    type === "product"
      ? queryKeys.products.detail(id)
      : queryKeys.articles.detail(id),
    type === "product"
      ? queryKeys.likes.products()
      : queryKeys.likes.articles(),
  ],
} as const;
