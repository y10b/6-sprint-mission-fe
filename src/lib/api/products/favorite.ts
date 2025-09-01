import { apiClient } from "../client";
import { logger } from "@/utils/logger";

export async function addFavorite(productId: number) {
  if (!productId) {
    throw new Error("상품 ID가 없습니다.");
  }

  try {
    const response = await apiClient.post(
      `/products/${productId}/favorite`,
      {}
    );
    return response;
  } catch (error) {
    logger.error("좋아요 추가 실패:", error);
    throw new Error("좋아요 추가에 실패했습니다.");
  }
}

export async function removeFavorite(productId: number) {
  if (!productId) {
    throw new Error("상품 ID가 없습니다.");
  }

  try {
    const response = await apiClient.delete(`/products/${productId}/favorite`);
    return response;
  } catch (error) {
    logger.error("좋아요 삭제 실패:", error);

    // JSON 파싱 에러 특별 처리
    if (error instanceof Error && error.message.includes("JSON")) {
      logger.warn("서버 응답 JSON 파싱 실패, 빈 응답으로 처리");
      // 서버에서 삭제는 성공했지만 응답이 잘못된 경우
      return { favoriteCount: 0, message: "좋아요가 삭제되었습니다." };
    }

    throw new Error("좋아요 삭제에 실패했습니다.");
  }
}
