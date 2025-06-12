import { getAccessToken, setAccessToken } from "./auth.api";

interface RequestInit extends globalThis.RequestInit {
  credentials?: RequestCredentials;
  headers?: HeadersInit;
}

export const fetchWithRefresh = async (
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> => {
  // Get the current access token
  const accessToken = getAccessToken();

  // 기존 헤더와 새로운 헤더를 병합
  const headers = {
    ...init.headers,
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  let res = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      // 액세스 토큰 만료로 판단
      const refreshRes = await fetch("http://localhost:5000/users/refresh", {
        method: "POST",
        credentials: "include", // ✅ 쿠키 포함
      });

      if (!refreshRes.ok) {
        throw new Error("로그인이 필요합니다.");
      }

      const refreshData = await refreshRes.json();
      // Store the new access token
      setAccessToken(refreshData.accessToken);

      // 새로운 요청 시도 with new token
      const newHeaders = {
        ...init.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshData.accessToken}`,
      };

      res = await fetch(input, {
        ...init,
        headers: newHeaders,
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
