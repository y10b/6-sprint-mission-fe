const BASE_URL = "https://panda-market-api.vercel.app";

export const getProducts = async ({ page, pageSize, orderBy, keyword }) => {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        orderBy,
    });

    if (keyword) {
        params.append("keyword", keyword);
    }

    const url = `${BASE_URL}/products?${params.toString()}`;


    const res = await fetch(url);

    if (!res.ok) throw new Error("데이터를 불러오는 데 실패했습니다");

    const data = await res.json();

    return {
        products: data.list,
        totalCount: data.totalCount,
    };
};


export const getCommentsByProductId = async ({
    productId,
    limit = 10,
    cursor = null,
}) => {
    if (!productId) throw new Error("productId는 필수입니다.");

    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor !== null) {
        params.append("cursor", String(cursor));
    }

    const url = `${BASE_URL}/products/${productId}/comments?${params.toString()}`;

    const res = await fetch(url);

    if (!res.ok) throw new Error("댓글을 불러오는 데 실패했습니다.");

    const data = await res.json();

    return {
        comments: data.list,
        nextCursor: data.nextCursor,
    };
};