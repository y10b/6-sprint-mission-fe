// 타입 중앙화 - 모든 타입을 여기서 재export
export * from "./auth";
export * from "./product";
export * from "./article";
export * from "./image";
export * from "./comment";

// === 컴포넌트 Props 타입들 ===
export type {
  ArticleCardProps,
  ArticleListProps,
  ArticleDetailProps,
  BestArticlesProps,
  SearchProps,
  PaginationProps,
  LikeComponentProps,
  DropdownMenuProps,
} from "./component";

// 공통 타입들
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  list: T[];
  totalCount: number;
  meta?: PaginationMeta;
}

// 일반적인 API 에러 타입
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// 기본 엔티티 인터페이스
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// 추가로 특정 타입들을 명시적으로 re-export (필요한 경우)
export type {
  GetCommentsResponse,
  GetProductCommentsResponse,
  GetArticleCommentsResponse,
} from "./comment";
