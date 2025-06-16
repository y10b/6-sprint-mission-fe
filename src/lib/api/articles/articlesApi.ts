import { Article } from "@/types/article";

const BASE_URL = "http://localhost:5000/api";

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
    const res = await fetch(`${BASE_URL}/articles?${params}`);
    if (!res.ok) throw new Error("게시글 데이터를 불러오는 데 실패했습니다.");

    const { articles, totalCount } = await res.json(); // ✅ 여기 수정
    return { articles, totalCount };
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw error;
  }
};

export async function updateArticle(
  articleId: number,
  title: string,
  content: string
): Promise<Article> {
  const response = await fetch(`${BASE_URL}/articles/${articleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
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
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "게시글 삭제에 실패했습니다.");
  }
}

export async function getArticle(articleId: number): Promise<Article> {
  const response = await fetch(`${BASE_URL}/articles/${articleId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "게시글을 불러오는데 실패했습니다.");
  }

  return response.json();
}

export async function getArticles(): Promise<Article[]> {
  const response = await fetch(`${BASE_URL}/articles`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "게시글 목록을 불러오는데 실패했습니다."
    );
  }

  return response.json();
}

export async function createArticle(
  title: string,
  content: string
): Promise<Article> {
  const response = await fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "게시글 작성에 실패했습니다.");
  }

  return response.json();
}
