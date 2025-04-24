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
    console.log("fetch 요청 URL 👉", url);

    const res = await fetch(url);

    if (!res.ok) throw new Error("데이터를 불러오는 데 실패했습니다");

    const data = await res.json();

    return {
        products: data.list,
        totalCount: data.totalCount,
    };
};
