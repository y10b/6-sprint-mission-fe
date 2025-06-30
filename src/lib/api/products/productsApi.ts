// api/product.ts
import {
  IProduct,
  ICreateProductInput,
  TUpdateProductInput,
  IProductsResponse,
  ApiResponse,
} from "@/types";
import { fetchWithRefresh } from "@/lib/api/auth/fetchWithRefresh";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 유효성 검사 함수
const validateProductData = (productData: ICreateProductInput): boolean => {
  if (
    !productData.name ||
    !productData.price ||
    !productData.tags ||
    !productData.imageUrls ||
    productData.imageUrls.length === 0
  ) {
    console.error(
      "Missing required fields: name, price, tags, and at least one imageUrl are required."
    );
    return false;
  }

  if (isNaN(productData.price)) {
    console.error("Price must be a valid number.");
    return false;
  }

  if (productData.imageUrls.length > 3) {
    console.error("A maximum of 3 images can be uploaded.");
    return false;
  }

  return true;
};

// 상품 생성
export const createProduct = async (
  productData: ICreateProductInput
): Promise<ApiResponse<IProduct>> => {
  try {
    if (!validateProductData(productData)) {
      return { success: false, error: "Invalid product data." };
    }

    const response = await fetchWithRefresh(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      return {
        success: false,
        error: text || "Failed to parse response.",
      };
    }

    if (response.ok) {
      return { success: true, data };
    } else {
      return {
        success: false,
        error: data.message || data.error || "Failed to create product.",
      };
    }
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
};

// 상품 목록 가져오기
export const getProducts = async ({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
  keyword = "",
}: {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  keyword?: string;
}): Promise<IProductsResponse> => {
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
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

// 상품 상세 가져오기
export const getProductById = async (id: number): Promise<IProduct> => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product details.");
    }

    const data: IProduct = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product details", error);
    throw error;
  }
};

// 상품 삭제하기
export const deleteProduct = async (
  productId: string
): Promise<Record<string, unknown>> => {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    let errorMessage = "상품 삭제 실패";

    try {
      const errorData = await res.json();
      errorMessage = errorData.message || "상품 삭제 실패";
    } catch (e) {
      const errorText = await res.text();
      errorMessage = errorText || "상품 삭제 실패 (응답 형식 오류)";
    }

    throw new Error(errorMessage);
  }

  try {
    const data = await res.json();
    return data;
  } catch {
    return {};
  }
};

// 상품 수정
export const updateProduct = async (
  productId: string,
  updatedData: TUpdateProductInput
): Promise<IProduct> => {
  try {
    const response = await fetchWithRefresh(
      `${BASE_URL}/products/${productId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update product.");
    }

    return data;
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
};
