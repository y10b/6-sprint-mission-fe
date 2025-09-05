/**
 * 스켈레톤 UI 컴포넌트들
 * 로딩 상태에서 사용자 경험을 개선하는 스켈레톤 컴포넌트 모음
 */

// =============================================================================
// 기본 스켈레톤 컴포넌트
// =============================================================================

export const SkeletonBase = ({
  className = "",
  ...props
}: {
  className?: string;
  [key: string]: any;
}) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

// =============================================================================
// 상품 관련 스켈레톤
// =============================================================================

/**
 * 상품 카드 스켈레톤
 */
export const ProductCardSkeleton = () => (
  <div className="w-full">
    {/* 상품 이미지 */}
    <SkeletonBase className="w-full aspect-square rounded-2xl mb-3" />

    {/* 상품 정보 */}
    <div className="space-y-2">
      {/* 상품명 */}
      <SkeletonBase className="h-4 w-3/4" />
      {/* 가격 */}
      <SkeletonBase className="h-6 w-1/2" />
      {/* 좋아요 버튼 */}
      <div className="flex items-center gap-2">
        <SkeletonBase className="w-5 h-5 rounded-full" />
        <SkeletonBase className="h-4 w-8" />
      </div>
    </div>
  </div>
);

/**
 * 상품 리스트 스켈레톤
 */
export const ProductListSkeleton = ({ count = 10 }: { count?: number }) => (
  <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <li key={i}>
        <ProductCardSkeleton />
      </li>
    ))}
  </ul>
);

/**
 * 상품 상세 페이지 스켈레톤
 */
export const ProductDetailSkeleton = () => (
  <div className="w-full max-w-4xl p-4 mt-6 mx-auto">
    <div className="sm:flex sm:gap-8">
      {/* 이미지 영역 */}
      <div className="sm:w-1/2">
        <SkeletonBase className="h-[343px] sm:h-[400px] rounded-xl mb-4" />
      </div>

      {/* 상품 정보 영역 */}
      <div className="sm:w-1/2 mt-4 sm:mt-0">
        <div className="space-y-4">
          {/* 제목과 드롭다운 */}
          <div className="flex justify-between items-start">
            <SkeletonBase className="h-6 w-3/4" />
            <SkeletonBase className="w-8 h-8 rounded" />
          </div>

          {/* 가격 */}
          <SkeletonBase className="h-8 w-1/2" />

          {/* 구분선 */}
          <hr className="border-gray-200" />

          {/* 상품 소개 */}
          <div className="space-y-2">
            <SkeletonBase className="h-5 w-20" />
            <SkeletonBase className="h-4 w-full" />
            <SkeletonBase className="h-4 w-4/5" />
            <SkeletonBase className="h-4 w-3/4" />
          </div>

          {/* 상품 태그 */}
          <div className="space-y-2">
            <SkeletonBase className="h-5 w-16" />
            <div className="flex flex-wrap gap-2">
              <SkeletonBase className="h-9 w-16 rounded-full" />
              <SkeletonBase className="h-9 w-20 rounded-full" />
              <SkeletonBase className="h-9 w-14 rounded-full" />
            </div>
          </div>

          {/* 판매자 정보 */}
          <div className="flex justify-between items-center mt-10">
            <div className="flex items-center gap-3">
              <SkeletonBase className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <SkeletonBase className="h-4 w-20" />
                <SkeletonBase className="h-3 w-16" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <SkeletonBase className="w-20 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// =============================================================================
// 게시글 관련 스켈레톤
// =============================================================================

/**
 * 게시글 카드 스켈레톤
 */
export const ArticleCardSkeleton = () => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex justify-between gap-4">
      <div className="flex-1 space-y-2">
        {/* 제목 */}
        <SkeletonBase className="h-6 w-3/4" />
        {/* 내용 */}
        <SkeletonBase className="h-4 w-full" />
        <SkeletonBase className="h-4 w-4/5" />
        {/* 작성자 정보 */}
        <div className="flex items-center gap-2 mt-3">
          <SkeletonBase className="w-6 h-6 rounded-full" />
          <SkeletonBase className="h-4 w-20" />
          <SkeletonBase className="h-4 w-16" />
        </div>
      </div>
      {/* 썸네일 */}
      <SkeletonBase className="w-[72px] h-[72px] rounded" />
    </div>
  </div>
);

/**
 * 게시글 리스트 스켈레톤
 */
export const ArticleListSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <ArticleCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * 베스트 게시글 스켈레톤
 */
export const BestArticlesSkeleton = () => (
  <div className="space-y-4">
    <SkeletonBase className="h-6 w-32" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonBase className="w-full h-32 rounded-lg" />
          <SkeletonBase className="h-4 w-3/4" />
          <SkeletonBase className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// 댓글 관련 스켈레톤
// =============================================================================

/**
 * 댓글 스켈레톤
 */
export const CommentSkeleton = () => (
  <div className="border-b border-gray-100 py-4">
    <div className="flex gap-3">
      {/* 프로필 이미지 */}
      <SkeletonBase className="w-8 h-8 rounded-full flex-shrink-0" />

      <div className="flex-1 space-y-2">
        {/* 작성자명과 시간 */}
        <div className="flex items-center gap-2">
          <SkeletonBase className="h-4 w-20" />
          <SkeletonBase className="h-3 w-16" />
        </div>

        {/* 댓글 내용 */}
        <SkeletonBase className="h-4 w-full" />
        <SkeletonBase className="h-4 w-3/4" />

        {/* 좋아요 버튼 */}
        <div className="flex items-center gap-1 mt-2">
          <SkeletonBase className="w-4 h-4 rounded" />
          <SkeletonBase className="h-3 w-6" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * 댓글 리스트 스켈레톤
 */
export const CommentListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-0">
    {Array.from({ length: count }).map((_, i) => (
      <CommentSkeleton key={i} />
    ))}
  </div>
);

// =============================================================================
// 기타 스켈레톤
// =============================================================================

/**
 * 검색바 스켈레톤
 */
export const SearchBarSkeleton = () => (
  <SkeletonBase className="w-full h-[42px] rounded-md" />
);

/**
 * 페이지네이션 스켈레톤
 */
export const PaginationSkeleton = () => (
  <div className="flex justify-center items-center gap-1 mt-10">
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonBase key={i} className="w-10 h-10 rounded-full" />
    ))}
  </div>
);

/**
 * 필터 스켈레톤
 */
export const FilterSkeleton = () => (
  <SkeletonBase className="w-32 h-10 rounded-md" />
);

/**
 * 헤더 스켈레톤
 */
export const HeaderSkeleton = () => (
  <div className="flex items-center justify-between p-4">
    <SkeletonBase className="h-8 w-32" />
    <div className="flex items-center gap-4">
      <SkeletonBase className="w-8 h-8 rounded-full" />
      <SkeletonBase className="w-8 h-8 rounded-full" />
    </div>
  </div>
);
