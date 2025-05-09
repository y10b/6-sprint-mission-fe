const BASE_URL = "http://localhost:5000/api";

export async function getCurrentUser() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.warn("[getCurrentUser] 토큰이 없습니다. 로그인 필요.");
        return null;
    }

    try {
        const res = await fetch(`${BASE_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // 명시적으로 추가
            },
        });

        console.log("[getCurrentUser] fetch 응답 status:", res.status);

        if (!res.ok) {
            console.error(`[getCurrentUser] 서버 응답 오류. status=${res.status}`);
            return null;
        }

        const userData = await res.json();
        return userData;
    } catch (error) {
        console.error("[getCurrentUser] 네트워크 에러:", error);
        return null;
    }
}
