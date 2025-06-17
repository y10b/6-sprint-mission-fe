import { ArticleComment } from "@/types/article";

interface Comment {
  id: number;
  content: string;
  userId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    nickname: string;
    image?: string | null;
  };
}

interface CommentResponse {
  success: boolean;
  data: Comment;
}

interface CommentsListResponse {
  list: Comment[];
  nextCursor: number | null;
}

const BASE_URL = "http://localhost:5000/api";

export async function postProductComment(
  productId: number,
  content: string
): Promise<CommentResponse> {
  if (!productId) {
    throw new Error("상품 ID가 없습니다.");
  }

  const res = await fetch(`${BASE_URL}/products/${productId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    console.log("accessToken:", localStorage.getItem("accessToken"));
    const errorData = await res.json();
    throw new Error(errorData.message || "댓글 작성에 실패했습니다.");
  }

  return res.json();
}

interface GetCommentsParams {
  productId: number;
  limit?: number;
  cursor?: number | null;
}

export interface GetCommentsResponse {
  comments: Comment[];
  nextCursor: number | null;
}

// 상품에 대한 댓글 조회 API
export async function getCommentsByProductId({
  productId,
  limit = 4,
  cursor = null,
}: GetCommentsParams): Promise<GetCommentsResponse> {
  if (!productId) {
    throw new Error("상품 ID가 없습니다.");
  }

  let url = `${BASE_URL}/products/${productId}/comments?limit=${limit}`;
  if (cursor) {
    url += `&cursor=${cursor}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "댓글 조회 실패");
  }

  const comments = await res.json();

  // 백엔드가 댓글 배열을 직접 반환하므로, 프론트엔드에서 필요한 형식으로 변환
  return {
    comments: comments || [],
    nextCursor:
      comments.length >= limit ? comments[comments.length - 1]?.id : null,
  };
}

export async function updateComment(
  commentId: number,
  content: string
): Promise<CommentResponse> {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "댓글 수정 실패");
  }

  return await res.json();
}

export async function deleteComment(
  commentId: number
): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "댓글 삭제 실패");
  }

  // 204 No Content 응답은 성공이지만 응답 본문이 없음
  return { success: true };
}

// 게시글 댓글 조회 API
export async function getArticleComments(
  articleId: number
): Promise<ArticleComment[]> {
  const response = await fetch(`${BASE_URL}/articles/${articleId}/comments`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "댓글을 불러오는데 실패했습니다.");
  }

  const data = await response.json();
  return data;
}

// 게시글 댓글 작성 API
export async function createArticleComment(
  articleId: number,
  content: string
): Promise<ArticleComment> {
  const response = await fetch(`${BASE_URL}/articles/${articleId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "댓글 작성에 실패했습니다.");
  }

  const data = await response.json();
  return data;
}

// 게시글 댓글 수정 API
export async function updateArticleComment(
  commentId: number,
  content: string
): Promise<ArticleComment> {
  const response = await fetch(`${BASE_URL}/articles/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "댓글 수정에 실패했습니다.");
  }

  const data = await response.json();
  return data;
}

// 게시글 댓글 삭제 API
export async function deleteArticleComment(commentId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/articles/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "댓글 삭제에 실패했습니다.");
  }
}
