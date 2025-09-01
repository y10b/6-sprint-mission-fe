// api/product.ts
import {
  IProduct,
  ICreateProductInput,
  TUpdateProductInput,
  IProductsResponse,
  IApiResponse,
} from "@/types";
import { apiClient, ApiClient } from "../client";
import { logger } from "@/utils/logger";

// 유효성 검사 함수
const validateProductData = (productData: ICreateProductInput): boolean => {
  if (
    !productData.name ||
    !productData.price ||
    !productData.tags ||
    !productData.imageUrls ||
    productData.imageUrls.length === 0
  ) {
    logger.error(
      "Missing required fields",
      new Error(
        "Missing required fields: name, price, tags, and at least one imageUrl are required."
      )
    );
    return false;
  }

  if (isNaN(productData.price)) {
    logger.error(
      "Price must be a valid number",
      new Error("Price must be a valid number.")
    );
    return false;
  }

  if (productData.imageUrls.length > 3) {
    logger.error(
      "A maximum of 3 images can be uploaded",
      new Error("A maximum of 3 images can be uploaded.")
    );
    return false;
  }

  return true;
};

// 상품 생성
export const createProduct = async (
  productData: ICreateProductInput
): Promise<IApiResponse<IProduct>> => {
  try {
    if (!validateProductData(productData)) {
      return { success: false, error: "Invalid product data." };
    }

    const data = await apiClient.post<IProduct>("/products", productData);
    return { success: true, data };
  } catch (error: any) {
    logger.error("상품 생성 오류", error);
    return {
      success: false,
      error: error.message || "상품 생성에 실패했습니다.",
    };
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
    const queryParams = ApiClient.createQueryParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      sort: orderBy,
      keyword,
    });

    const data = await apiClient.get<IProductsResponse>(
      `/products${queryParams}`
    );
    return data;
  } catch (error) {
    logger.error("Error fetching products", error);
    throw error;
  }
};

// 상품 상세 가져오기
export const getProductById = async (id: number): Promise<IProduct> => {
  try {
    const data = await apiClient.get<IProduct>(`/products/${id}`);
    return data;
  } catch (error) {
    logger.error("Error fetching product details", error);
    throw error;
  }
};

// 상품 삭제하기
export const deleteProduct = async (
  productId: string
): Promise<Record<string, unknown>> => {
  try {
    const result = await apiClient.delete<Record<string, unknown>>(
      `/products/${productId}`
    );
    return result;
  } catch (error) {
    logger.error("상품 삭제 오류", error);
    throw error;
  }
};

// 상품 수정
export const updateProduct = async (
  productId: string,
  updatedData: TUpdateProductInput
): Promise<IProduct> => {
  try {
    const data = await apiClient.patch<IProduct>(
      `/products/${productId}`,
      updatedData
    );
    return data;
  } catch (error) {
    logger.error("Error updating product", error);
    throw error;
  }
};
