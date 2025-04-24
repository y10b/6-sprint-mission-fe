export async function getProducts({ page, pageSize, orderBy, keyword }) {
    const params = new URLSearchParams({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        sort: orderBy,
        search: keyword,
    });

    const response = await fetch(`/api/products?${params.toString()}`);

    if (!response.ok) {
        throw new Error("데이터 요청 실패");
    }

    const data = await response.json();

    return {
        products: Array.isArray(data.list) ? data.list : [],
        totalCount: typeof data.totalCount === "number" ? data.totalCount : 0,
    };
}
// 바꾸기


export const getProductById = async (id) => {
    const response = await fetch(`/api/products/${id}`); // 실제 API URL로 수정
    if (!response.ok) {
        throw new Error("상품을 불러오는 데 실패했습니다.");
    }
    return await response.json();
};