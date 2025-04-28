const BASE_URL = "https://panda-market-api.vercel.app";

export async function toggleFavorite(productId, isCurrentlyFavorite) {
    if (!productId) {
        throw new Error("상품 ID가 없습니다.");
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
        throw new Error("로그인이 필요합니다.");
    }

    const url = `${BASE_URL}/products/${productId}/favorite`;
    const method = isCurrentlyFavorite ? "DELETE" : "POST";

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        // POST일 때 빈 body 필요할 수 있어서 POST만 빈 JSON 추가
        body: method === "POST" ? JSON.stringify({}) : undefined,
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "좋아요 처리 실패");
    }

    return await res.json();
}
