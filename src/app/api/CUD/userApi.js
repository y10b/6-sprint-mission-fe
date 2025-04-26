const BASE_URL = "https://panda-market-api.vercel.app";

export async function getCurrentUser() {
    const token = localStorage.getItem("accessToken");
    console.log("[getCurrentUser] token:", token);

    const res = await fetch(`${BASE_URL}/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    console.log("[getCurrentUser] fetch 응답 status:", res.status);

    if (!res.ok) {
        const errorData = await res.json();
        console.error("[getCurrentUser] 에러 응답:", errorData);
        return null;
    }
    const userData = await res.json();
    console.log("[getCurrentUser] 유저 데이터:", userData);
    return userData;
}