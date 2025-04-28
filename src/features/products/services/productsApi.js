// src/api/productsApi.js

const BASE_URL = "https://panda-market-api.vercel.app";

// 유효성 검사 함수
const validateProductData = (productData) => {
    if (!productData.name || !productData.price || !productData.tags || !productData.images) {
        console.error('Missing required fields: name, price, tags, and images are required.');
        return false;
    }

    if (isNaN(productData.price)) {
        console.error('Price must be a valid number.');
        return false;
    }

    return true;
};

// 상품 생성
export const createProduct = async (productData) => {
    try {
        if (!validateProductData(productData)) {
            return { success: false, error: "Invalid product data." };
        }

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('Authorization token is missing. Please log in.');
            return { success: false, error: "Authorization token missing." };
        }

        const response = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(productData),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Product created successfully', data);
            return { success: true, data };
        } else {
            console.error('Product creation failed', data.message, data.details);
            return { success: false, error: data.message || "Failed to create product." };
        }
    } catch (error) {
        console.error('Error creating product', error);
        return { success: false, error: error.message };
    }
};

// 상품 목록 가져오기
export const getProducts = async ({ page = 1, pageSize = 10, orderBy = "recent", keyword = "" }) => {
    try {
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
    } catch (error) {
        console.error('Error fetching products', error);
        throw error;
    }
};

// 상품 상세 가져오기
export const getProductById = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await fetch(`${BASE_URL}/products/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch product details.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching product details', error);
        throw error;
    }
};


export async function deleteProduct(productId) {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("로그인이 필요합니다.");

    const res = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "상품 삭제 실패");
    }

    return await res.json();
}