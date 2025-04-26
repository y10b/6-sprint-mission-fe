
const BASE_URL = "https://panda-market-api.vercel.app";

// 상품 댓글 작성 API
export async function postProductComment(productId, content) {
    if (!productId) {
        throw new Error("상품 ID가 없습니다.");
    }

    const token = localStorage.getItem("accessToken"); // 인증 토큰 가져오기

    const res = await fetch(`${BASE_URL}/products/${productId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "댓글 작성에 실패했습니다.");
    }

    return res.json(); // 성공 시 댓글 데이터 반환
}
