import { refreshToken } from "@/lib/api/auth/auth.api";
import { logger } from "@/utils/logger";

interface FetchOptions extends RequestInit {
  retryCount?: number;
}

export async function fetchWithRefresh(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { retryCount = 0, ...fetchOptions } = options;

  // 최대 재시도 횟수를 초과하면 에러를 던집니다
  if (retryCount >= 1) {
    throw new Error("Max retry count exceeded");
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        "Content-Type": "application/json",
      },
    });

    // 401 에러가 아니면 바로 응답을 반환합니다
    if (response.status !== 401) {
      return response;
    }

    // 토큰 갱신을 시도합니다
    const refreshResponse = await refreshToken();

    // 새로운 액세스 토큰으로 원래 요청을 재시도합니다
    return fetchWithRefresh(url, {
      ...options,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${refreshResponse.accessToken}`,
      },
      retryCount: retryCount + 1,
    });
  } catch (error) {
    logger.error("요청 처리 실패", error);
    throw error;
  }
}
