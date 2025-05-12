const BASE_URL = "http://localhost:5000/api";


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

        const response = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(productData),
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            const text = await response.text();
            console.error("Failed to parse JSON. Raw response:", text);
            return {
                success: false,
                error: text || "Failed to parse response.",
            };
        }

        if (response.ok) {
            console.log('Product created successfully', data);
            return { success: true, data };
        } else {
            return {
                success: false,
                error: data.message || data.error || "Failed to create product.",
            };
        }

    } catch (error) {
        console.error('Error creating product', error);
        return { success: false, error: error.message || "Unknown error" };
    }
};


// 상품 목록 가져오기
export const getProducts = async ({ page = 1, pageSize = 10, orderBy = "recent", keyword = "" }) => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            sort: orderBy,
            keyword,
        });

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
    try {
        const response = await fetch(`${BASE_URL}/products/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // 쿠키 인증 등을 사용하는 경우 필요
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error("Failed to fetch product details.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching product details", error);
        throw error;
    }
};

export async function deleteProduct(productId) {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "상품 삭제 실패");
    }

    return await res.json();
}

//상품 수정
export const updateProduct = async (productId, updatedData) => {


    try {
        const response = await fetch(`${BASE_URL}/products/${productId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updatedData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Product update failed', data.message);
            throw new Error(data.message || "Failed to update product.");
        }

        console.log('Product updated successfully', data);
        return data;
    } catch (error) {
        console.error('Error updating product', error);
        throw error;
    }
};