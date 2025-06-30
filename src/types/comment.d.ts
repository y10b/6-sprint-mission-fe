// === 기본 엔티티 인터페이스 (순환 import 방지) ===
interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// === 기본 댓글 인터페이스 ===
export interface IComment extends BaseEntity {
  content: string;
  userId: number;
  user: {
    id: number;
    nickname: string;
    image?: string | null;
  };
}

// === 상품 댓글 ===
export interface IProductComment extends IComment {
  productId: number;
}

// === 게시글 댓글 ===
export interface IArticleComment extends IComment {
  articleId: number;
  productId: number | null;
}

// === API 응답 타입 ===
export interface CommentResponse {
  success: boolean;
  data: IComment;
}

export interface CommentsListResponse {
  list: IComment[];
  nextCursor: number | null;
}

// 제네릭 버전으로 수정하여 유연성 확보
export interface GetCommentsResponse<T = IComment> {
  comments: T[];
  nextCursor: number | null;
}

// 특정 타입별 응답
export interface GetProductCommentsResponse
  extends GetCommentsResponse<IProductComment> {}
export interface GetArticleCommentsResponse
  extends GetCommentsResponse<IArticleComment> {}

// === API 입력 타입 ===
export interface CreateCommentInput {
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}

// === API 파라미터 타입 ===
export interface GetCommentsParams {
  productId?: number;
  articleId?: number;
  limit?: number;
  cursor?: number | null;
}
