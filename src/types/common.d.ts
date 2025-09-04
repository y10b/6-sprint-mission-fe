/**
 * 프론트엔드 공통 타입 정의 파일
 * 프로젝트 전체에서 사용되는 공통 타입들을 중앙 관리합니다.
 */

// =============================================================================
// 공통 기본 타입
// =============================================================================

// ID 타입
export type TId = number;

// 기본 엔티티 인터페이스
export interface IBaseEntity {
  id: TId;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 페이지네이션 메타데이터 타입
export interface IPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

// 페이지네이션 응답 타입
export interface IPaginatedResponse<T> {
  list: T[];
  totalCount: number;
  meta?: IPaginationMeta;
}

// 페이지네이션 파라미터 타입
export interface IPaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  orderBy?: string;
  keyword?: string;
}

// 정렬 옵션 타입
export type TSortOrder = "asc" | "desc";

// 날짜 범위 타입
export interface IDateRange {
  startDate: Date;
  endDate: Date;
}

// API 에러 타입
export interface IApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// =============================================================================
// 사용자 관련 공통 타입
// =============================================================================

// 기본 사용자 인터페이스
export interface IUser extends IBaseEntity {
  email: string;
  nickname: string;
  image?: string | null;
}

// 사용자 등록 입력 타입
export interface ISignupInput {
  email: string;
  nickname: string;
  password: string;
}

// 사용자 로그인 입력 타입
export interface ILoginInput {
  email: string;
  password: string;
}

// =============================================================================
// 폼 관련 공통 타입
// =============================================================================

// 비밀번호 표시 상태 타입
export interface IShowPasswordState {
  password: boolean;
  passwordConfirmation?: boolean;
}

// 폼 필드 값 타입
export type TFormFieldValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

// 폼 에러 타입
export interface IFormError {
  field: string;
  message: string;
}

// =============================================================================
// UI 컴포넌트 공통 타입
// =============================================================================

// 버튼 변형 타입
export type TButtonVariant = "primary" | "secondary" | "danger" | "outline";

// 버튼 크기 타입
export type TButtonSize = "small" | "medium" | "large";

// 모달 상태 타입
export type TModalState = "open" | "closed" | "loading";

// 로딩 상태 타입
export type TLoadingState = "idle" | "loading" | "success" | "error";

// =============================================================================
// 이미지 관련 공통 타입
// =============================================================================

// 이미지 데이터 타입
export interface IImageData {
  file: File;
  url: string;
}

// 업로드된 이미지 타입
export interface IUploadedImage {
  file: File;
  url: string;
}

// 이미지 업로드 응답 타입
export interface IImageUploadResponse {
  imageUrl: string;
  message?: string;
}

// =============================================================================
// 검색 관련 공통 타입
// =============================================================================

// 검색 파라미터 타입
export interface ISearchParams {
  keyword?: string;
  sortBy?: string;
  sortOrder?: TSortOrder;
  filters?: Record<string, any>;
}

// 검색 결과 타입
export interface ISearchResult<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string | number;
}

// =============================================================================
// 커서 기반 페이지네이션 타입
// =============================================================================

// 커서 페이지네이션 파라미터 타입
export interface ICursorPaginationParams {
  limit?: number;
  cursor?: number | string | null;
}

// 커서 페이지네이션 응답 타입
export interface ICursorPaginatedResponse<T> {
  list: T[];
  nextCursor: number | string | null;
  hasMore: boolean;
}




