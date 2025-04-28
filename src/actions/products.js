const BASE_URL = "https://panda-market-api.vercel.app";
export const getProducts = async ({ page = 1, pageSize = 10, orderBy = "recent", keyword = "" }) => {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        orderBy,
        keyword,
    });

    console.log("Requesting products with params:", params.toString());

    const response = await fetch(`${BASE_URL}/products?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("Response data:", data);

    return {
        products: data.list,
        total: data.totalCount,
    };
};



export const getProductById = async (id) => {
    const response = await fetch(`/api/products/${id}`); // 실제 API URL로 수정
    if (!response.ok) {
        throw new Error("상품을 불러오는 데 실패했습니다.");
    }
    return await response.json();
};