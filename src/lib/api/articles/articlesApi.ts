import { IArticle, ICreateArticleInput, TUpdateArticleInput } from "@/types";
import { logger } from "@/utils/logger";
import { apiClient, ApiClient } from "../client";

export const fetchArticlesFromAPI = async ({
  page = 1,
  limit = 4,
  sort = "latest",
  keyword = "",
}) => {
  const queryParams = ApiClient.createQueryParams({
    page: String(page),
    limit: String(limit),
    sort,
    keyword,
  });

  try {
    const data = await apiClient.get<{
      articles: IArticle[];
      totalCount: number;
    }>(`/articles${queryParams}`);
    return {
      articles: data.articles,
      totalCount: data.totalCount,
    };
  } catch (error) {
    logger.error("API 호출 실패:", error);
    throw error;
  }
};

export const getArticleWithLikes = async (articleId: number) => {
  try {
    const data = await apiClient.get<{ likeCount: number; isLiked: boolean }>(
      `/articles/${articleId}`
    );
    return {
      likeCount: data.likeCount || 0,
      isLiked: data.isLiked || false,
    };
  } catch (error) {
    logger.error("게시글 정보 조회 실패:", error);
    throw error;
  }
};

export const toggleArticleLike = async (articleId: number) => {
  try {
    const data = await apiClient.post<{ liked: boolean }>(
      `/articles/${articleId}/favorite`
    );
    return {
      liked: data.liked,
    };
  } catch (error) {
    logger.error("좋아요 토글 실패:", error);
    throw error;
  }
};

export async function updateArticle(
  articleId: number,
  updateData: TUpdateArticleInput
): Promise<IArticle> {
  try {
    return await apiClient.patch<IArticle>(
      `/articles/${articleId}`,
      updateData
    );
  } catch (error) {
    logger.error("게시글 수정 실패:", error);
    throw error;
  }
}

export async function deleteArticle(articleId: number): Promise<void> {
  try {
    await apiClient.delete(`/articles/${articleId}`);
  } catch (error) {
    logger.error("게시글 삭제 실패:", error);
    throw error;
  }
}

export async function getArticle(articleId: number): Promise<IArticle> {
  try {
    return await apiClient.get<IArticle>(`/articles/${articleId}`);
  } catch (error) {
    logger.error("게시글 조회 실패:", error);
    throw error;
  }
}

export async function getArticles(): Promise<IArticle[]> {
  try {
    return await apiClient.get<IArticle[]>(`/articles`);
  } catch (error) {
    logger.error("게시글 목록 조회 실패:", error);
    throw error;
  }
}

export async function createArticle(
  articleData: ICreateArticleInput
): Promise<IArticle> {
  try {
    return await apiClient.post<IArticle>(`/articles`, articleData);
  } catch (error) {
    logger.error("게시글 작성 실패:", error);
    throw error;
  }
}
