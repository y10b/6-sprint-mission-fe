import { fetchWithRefresh } from "@/lib/api/auth/fetchWithRefresh";

const BASE_URL = process.env.NEXT_PUBLIC_API_AUTH;

export async function getCurrentUser() {
  try {
    const res = await fetchWithRefresh(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`[getCurrentUser] 서버 응답 오류. status=${res.status}`);
      return null;
    }

    const userData = await res.json();
    return userData;
  } catch (error) {
    console.error("[getCurrentUser] 네트워크 에러 또는 인증 실패:", error);
    return null;
  }
}
