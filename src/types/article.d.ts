import { IBaseEntity, TId, IPaginatedResponse } from "./common";

/**
 * 게시글 관련 특화 타입 및 인터페이스 정의
 * (공통 타입은 common.d.ts에서 관리)
 */

// 게시글 댓글 타입 (comment.d.ts에서 import)
export type { IArticleComment } from "./comment";

// === 게시글 엔티티 ===
export interface IArticle extends IBaseEntity {
  title: string;
  content: string;
  authorNickname: string;
  user: {
    id: TId;
    nickname: string;
  };
  authorImage?: string | null;
  images: string;
  likeCount: number;
  isLiked: boolean;
}

// === API 응답 타입 ===
export interface IArticlesResponse extends IPaginatedResponse<IArticle> {}

// === API 입력 타입 ===
export interface ICreateArticleInput {
  title: string;
  content: string;
  images?: string;
}

export type TUpdateArticleInput = Partial<ICreateArticleInput>;

// === 폼 데이터 타입 ===
export type TArticleFormData = Pick<IArticle, "title" | "content" | "images">;

// === 서버 댓글 타입 (호환성을 위해 유지) ===
export type TServerComment = IArticleComment;
