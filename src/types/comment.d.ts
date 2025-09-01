import {
  IBaseEntity,
  TId,
  ICursorPaginatedResponse,
  ICursorPaginationParams,
} from "./common";

/**
 * 댓글 관련 특화 타입 및 인터페이스 정의
 * (공통 타입은 common.d.ts에서 관리)
 */

// === 기본 댓글 인터페이스 ===
export interface IComment extends IBaseEntity {
  content: string;
  userId: TId;
  user: {
    id: TId;
    nickname: string;
    image?: string | null;
  };
}

// === 상품 댓글 ===
export interface IProductComment extends IComment {
  productId: TId;
}

// === 게시글 댓글 ===
export interface IArticleComment extends IComment {
  articleId: TId;
  productId: TId | null;
}

// === API 응답 타입 ===
export interface ICommentResponse {
  success: boolean;
  data: IComment;
}

export interface ICommentsListResponse {
  list: IComment[];
  nextCursor: number | null;
}

// 제네릭 버전으로 수정하여 유연성 확보
export interface IGetCommentsResponse<T = IComment>
  extends ICursorPaginatedResponse<T> {
  comments: T[];
}

// 특정 타입별 응답
export interface IGetProductCommentsResponse
  extends IGetCommentsResponse<IProductComment> {}
export interface IGetArticleCommentsResponse
  extends IGetCommentsResponse<IArticleComment> {}

// === API 입력 타입 ===
export interface ICreateCommentInput {
  content: string;
}

export interface IUpdateCommentInput {
  content: string;
}

// === API 파라미터 타입 ===
export interface IGetCommentsParams extends ICursorPaginationParams {
  productId?: TId;
  articleId?: TId;
}
