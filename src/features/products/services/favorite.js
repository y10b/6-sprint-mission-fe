const BASE_URL = "https://panda-market-api.vercel.app";

export async function addFavorite(productId) {
    if (!productId) {
        throw new Error("상품 ID가 없습니다.");
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
        throw new Error("로그인이 필요합니다.");
    }

    const url = `${BASE_URL}/products/${productId}/favorite`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}), // POST일 때 빈 body 추가
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "좋아요 추가 실패");
    }

    return await res.json();
}

export async function removeFavorite(productId) {
    if (!productId) {
        throw new Error("상품 ID가 없습니다.");
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
        throw new Error("로그인이 필요합니다.");
    }

    const url = `${BASE_URL}/products/${productId}/favorite`;

    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "좋아요 삭제 실패");
    }

    return await res.json();
}