import { IArticle, ICreateArticleInput, TUpdateArticleInput } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchArticlesFromAPI = async ({
  page = 1,
  limit = 4,
  sort = "latest",
  keyword = "",
}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
    keyword,
  });

  try {
    const res = await fetch(`${BASE_URL}/articles?${params}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error("게시글 데이터를 불러오는 데 실패했습니다.");

    const data = await res.json();
    return {
      articles: data.articles,
      totalCount: data.totalCount,
    };
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw error;
  }
};

export const getArticleWithLikes = async (articleId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/articles/${articleId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("게시글 정보를 가져오는데 실패했습니다.");
    }

    const data = await response.json();
    return {
      likeCount: data.likeCount || 0,
      isLiked: data.isLiked || false,
    };
  } catch (error) {
    console.error("게시글 정보 조회 실패:", error);
    throw error;
  }
};

export const toggleArticleLike = async (articleId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/articles/${articleId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("좋아요 토글에 실패했습니다.");
    }

    const data = await response.json();
    return {
      liked: data.liked,
    };
  } catch (error) {
    console.error("좋아요 토글 실패:", error);
    throw error;
  }
};

export async function updateArticle(
  articleId: number,
  updateData: TUpdateArticleInput
): Promise<IArticle> {
  const response = await fetch(`${BASE_URL}/articles/${articleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "게시글 수정에 실패했습니다.");
  }

  return response.json();
}

export async function deleteArticle(articleId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/articles/${articleId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "게시글 삭제에 실패했습니다.");
  }
}

export async function getArticle(articleId: number): Promise<IArticle> {
  const response = await fetch(`${BASE_URL}/articles/${articleId}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "게시글을 불러오는데 실패했습니다.");
  }

  return response.json();
}

export async function getArticles(): Promise<IArticle[]> {
  const response = await fetch(`${BASE_URL}/articles`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "게시글 목록을 불러오는데 실패했습니다."
    );
  }

  return response.json();
}

export async function createArticle(
  articleData: ICreateArticleInput
): Promise<IArticle> {
  const response = await fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(articleData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "게시글 작성에 실패했습니다.");
  }

  return response.json();
}
