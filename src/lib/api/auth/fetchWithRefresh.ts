import { ApiError } from "@/types";

interface RequestInit extends globalThis.RequestInit {
  credentials?: RequestCredentials;
  headers?: HeadersInit;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_AUTH;

export const fetchWithRefresh = async (
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> => {
  // 기존 헤더와 새로운 헤더를 병합
  const headers = {
    ...init.headers,
    "Content-Type": "application/json",
  };

  let res = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      // 액세스 토큰 만료로 판단하고 리프레시 시도
      const refreshRes = await fetch(`${BASE_URL}/users/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        throw new Error("로그인이 필요합니다.");
      }

      // 새로운 요청 시도
      res = await fetch(input, {
        ...init,
        headers,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("요청 실패");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw new Error("토큰 갱신에 실패했습니다.");
    }
  }

  return res;
};
