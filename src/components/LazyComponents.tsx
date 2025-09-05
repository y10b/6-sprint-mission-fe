/**
 * 레이지 로딩을 위한 컴포넌트 정의
 * 코드 스플리팅으로 초기 번들 크기 최적화
 */

import { lazy, Suspense } from "react";
import { ComponentType } from "react";

// =============================================================================
// 로딩 컴포넌트들
// =============================================================================

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const LoadingCard = () => (
  <div className="bg-gray-100 p-4 rounded-lg shadow-md h-[138px] animate-pulse">
    <div className="flex justify-between gap-4">
      <div className="flex-1">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
      <div className="w-[72px] h-[72px] bg-gray-300 rounded"></div>
    </div>
  </div>
);

const LoadingButton = () => (
  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
);

// =============================================================================
// 레이지 로딩 컴포넌트들
// =============================================================================

// 게시글 관련 컴포넌트들
export const LazyArticleList = lazy(() => import("./articles/ArticleList"));
export const LazyArticleDetail = lazy(() => import("./articles/ArticleDetail"));
export const LazyBestArticles = lazy(() => import("./articles/BestArticles"));

// 검색 및 필터 컴포넌트들
export const LazySearch = lazy(() => import("./Search"));
export const LazyFilters = lazy(() => import("./Filters"));
export const LazyPagination = lazy(() => import("./Pagination"));

// 좋아요 컴포넌트들
export const LazyLikeToProduct = lazy(() => import("./LikeToProduct"));
export const LazyLikeToArticle = lazy(() => import("./LikeToArticle"));

// 폼 관련 컴포넌트들
export const LazyFormInput = lazy(() => import("./FormInput"));
export const LazyFormTextarea = lazy(() => import("./FormTextarea"));
export const LazyTagInput = lazy(() => import("./TagInput"));
export const LazyImageUploader = lazy(() => import("./ImageUploader"));

// 모달 및 UI 컴포넌트들
export const LazyDeleteModal = lazy(() => import("./DeleteModal"));
export const LazyDropdownMenu = lazy(() => import("./Dropdownmenu"));

// 댓글 관련 컴포넌트들
export const LazyCommentsProducts = lazy(
  () => import("./comments/_product/CommentsProducts")
);
export const LazyCommentsArticles = lazy(
  () => import("./comments/_article/commentsection")
);

// =============================================================================
// HOC (Higher-Order Component) 래퍼들
// =============================================================================

/**
 * 레이지 로딩 컴포넌트를 Suspense로 감싸는 HOC
 */
export function withSuspense<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: React.ReactNode
) {
  const WithSuspenseComponent = (props: P) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <WrappedComponent {...props} />
    </Suspense>
  );

  WithSuspenseComponent.displayName = `withSuspense(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithSuspenseComponent;
}

/**
 * 특정 컴포넌트용 커스텀 로딩 상태를 가진 Suspense 래퍼들
 */
export const ArticleListWithSuspense = withSuspense(
  LazyArticleList,
  <div className="space-y-6 mt-10">
    {Array.from({ length: 3 }).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);

export const SearchWithSuspense = withSuspense(
  LazySearch,
  <div className="relative w-full h-[42px] bg-gray-200 rounded-md animate-pulse"></div>
);

export const PaginationWithSuspense = withSuspense(
  LazyPagination,
  <div className="flex justify-center items-center gap-1 mt-10">
    {Array.from({ length: 5 }).map((_, i) => (
      <LoadingButton key={i} />
    ))}
  </div>
);

export const LikeToProductWithSuspense = withSuspense(
  LazyLikeToProduct,
  <div className="flex items-center gap-1.5">
    <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
    <div className="w-8 h-4 bg-gray-300 rounded animate-pulse"></div>
  </div>
);

// =============================================================================
// 동적 import 헬퍼 함수들
// =============================================================================

/**
 * 컴포넌트를 조건부로 로드하는 헬퍼
 */
export async function loadComponentConditionally<T>(
  condition: boolean,
  importFn: () => Promise<{ default: T }>
): Promise<T | null> {
  if (!condition) return null;

  try {
    const module = await importFn();
    return module.default;
  } catch (error) {
    console.error("컴포넌트 로딩 실패:", error);
    return null;
  }
}

/**
 * 사용자 인터랙션 후 컴포넌트 프리로드
 */
export function preloadComponent(importFn: () => Promise<any>) {
  return () => {
    // 마우스 호버나 클릭 전에 미리 로드
    importFn().catch(console.error);
  };
}

// =============================================================================
// 사용 예시 Export
// =============================================================================

export const preloadArticleDetail = preloadComponent(
  () => import("./articles/ArticleDetail")
);
export const preloadImageUploader = preloadComponent(
  () => import("./ImageUploader")
);
export const preloadDeleteModal = preloadComponent(
  () => import("./DeleteModal")
);
