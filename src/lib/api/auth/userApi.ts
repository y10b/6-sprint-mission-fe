import { fetchWithRefresh } from "@/lib/api/auth/fetchWithRefresh";
import { logger } from "@/utils/logger";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCurrentUser() {
  try {
    const res = await fetchWithRefresh(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      logger.error(
        "사용자 정보 조회 실패",
        new Error(`서버 응답 오류. status=${res.status}`)
      );
      return null;
    }

    const userData = await res.json();
    return userData;
  } catch (error) {
    logger.error("사용자 정보 조회 중 네트워크 에러", error);
    return null;
  }
}
