const BASE_URL = "http://localhost:5000/api";

export async function postProductComment(productId, content) {
    if (!productId) {
        throw new Error("상품 ID가 없습니다.");
    }

    const res = await fetch(`${BASE_URL}/products/${productId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "댓글 작성에 실패했습니다.");
    }

    return res.json();
}

// 상품에 대한 댓글 조회 API
export async function getCommentsByProductId({ productId, limit = 4, cursor = null }) {
    if (!productId) {
        throw new Error("상품 ID가 없습니다.");
    }

    let url = `${BASE_URL}/products/${productId}/comments?limit=${limit}`;
    if (cursor) {
        url += `&cursor=${cursor}`;
    }

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "댓글 조회 실패");
    }

    const data = await res.json();

    return {
        comments: data.list || [],
        nextCursor: data.nextCursor || null,  // nextCursor 추가
    };
}

export async function updateComment(commentId, content) {

    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "댓글 수정 실패");
    }

    return await res.json();
}

export async function deleteComment(commentId) {

    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "댓글 삭제 실패");
    }

    return await res.json();
}