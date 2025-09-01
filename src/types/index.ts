/**
 * 타입 중앙화 - 모든 타입을 여기서 재export
 * 백엔드의 express.d.ts와 같은 역할을 합니다.
 */

// === 공통 타입 (우선 순위 높음) ===
export * from "./common";

// === 도메인별 특화 타입들 ===
export * from "./auth";
export * from "./product";
export * from "./article";
export * from "./image";
export * from "./comment";

// === 컴포넌트 Props 타입들 ===
export * from "./component";

// === 레거시 호환성을 위한 타입 별칭들 ===
// 기존 코드와의 호환성을 위해 유지

// 공통 타입들 (common.d.ts에서 가져옴)
export type {
  // 기본 타입들
  TId,
  IBaseEntity as BaseEntity, // 기존 이름 호환
  IApiResponse as ApiResponse, // 기존 이름 호환
  IPaginationMeta as PaginationMeta, // 기존 이름 호환
  IPaginatedResponse as PaginatedResponse, // 기존 이름 호환
  IApiError as ApiError, // 기존 이름 호환

  // 폼 관련
  IShowPasswordState as ShowPasswordState, // 기존 이름 호환

  // 이미지 관련
  IImageData as ImageData, // 기존 이름 호환
  IUploadedImage as UploadedImage, // 기존 이름 호환
} from "./common";

// 컴포넌트 타입들 (component.d.ts에서 가져옴)
export type {
  // 기존 이름 호환을 위한 별칭
  IArticleCardProps as ArticleCardProps,
  IArticleListProps as ArticleListProps,
  IArticleDetailProps as ArticleDetailProps,
  IBestArticlesProps as BestArticlesProps,
  ISearchProps as SearchProps,
  IPaginationProps as PaginationProps,
  ILikeComponentProps as LikeComponentProps,
  IDropdownMenuProps as DropdownMenuProps,
} from "./component";

// 댓글 타입들 (comment.d.ts에서 가져옴)
export type {
  IGetCommentsResponse as GetCommentsResponse, // 기존 이름 호환
  IGetProductCommentsResponse as GetProductCommentsResponse, // 기존 이름 호환
  IGetArticleCommentsResponse as GetArticleCommentsResponse, // 기존 이름 호환
} from "./comment";
