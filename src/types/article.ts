export interface Article {
  id: number;
  title: string;
  content: string;
  author?: string;
  authorImage?: string | null;
  images?: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface ArticleComment {
  id: number;
  content: string;
  userId: number;
  articleId: number;
  productId: number | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    nickname: string;
  };
}

// 서버로부터 받는 댓글 타입
export interface ServerComment {
  id: number;
  content: string;
  userId: number;
  articleId: number;
  productId: number | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    nickname: string;
  };
}
