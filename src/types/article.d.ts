import { BaseEntity } from "./index";

export interface IArticle extends BaseEntity {
  title: string;
  content: string;
  authorNickname: string;
  user: {
    id: number;
    nickname: string;
  };
  authorImage?: string | null;
  images: string;
  likeCount: number;
  isLiked: boolean;
}

// IArticleComment는 comment.d.ts에서 정의됨
// 서버로부터 받는 댓글 타입 (IArticleComment와 동일하므로 comment.d.ts의 IArticleComment를 재export)
export type { IArticleComment } from "./comment";
export type ServerComment = IArticleComment;

export type TArticleFormData = Pick<IArticle, "title" | "content" | "images">;

// Article 목록 응답 타입
export interface IArticlesResponse {
  list: IArticle[];
  totalCount: number;
}

// Article 생성/수정 입력 타입
export interface ICreateArticleInput {
  title: string;
  content: string;
  images?: string;
}

export type TUpdateArticleInput = Partial<ICreateArticleInput>;
