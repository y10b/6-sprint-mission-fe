import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IProduct,
  IProductsResponse,
  ICreateProductInput,
  TUpdateProductInput,
  TId,
  IApiResponse,
} from "@/types";
import {
  queryKeys,
  createQueryOptions,
  createMutationOptions,
  invalidationTargets,
  DEFAULT_QUERY_OPTIONS,
  STATIC_QUERY_OPTIONS,
} from "../query-options";
import * as productsApi from "../../api/products/productsApi";

/**
 * 상품 관련 React Query 훅들
 */

// =============================================================================
// Query 훅들
// =============================================================================

/**
 * 상품 목록 조회
 */
export function useProducts(
  filters: {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    keyword?: string;
  } = {}
) {
  return useQuery({
    ...createQueryOptions<IProductsResponse>({
      ...DEFAULT_QUERY_OPTIONS,
      // 상품 목록은 자주 변경되므로 staleTime을 짧게
      staleTime: 2 * 60 * 1000, // 2분
    }),
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsApi.getProducts(filters),
  });
}

/**
 * 상품 상세 조회
 */
export function useProduct(productId: TId, enabled: boolean = true) {
  return useQuery({
    ...createQueryOptions<IProduct>({
      ...STATIC_QUERY_OPTIONS,
      staleTime: 5 * 60 * 1000, // 5분으로 단축 (이미지 업데이트 반영을 위해)
      enabled: enabled && !!productId,
      queryKey: queryKeys.products.detail(productId),
      queryFn: () => productsApi.getProductById(productId),
    }),
  });
}

// =============================================================================
// Mutation 훅들
// =============================================================================

/**
 * 상품 생성
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateProductInput) => productsApi.createProduct(data),
    ...createMutationOptions<
      IApiResponse<IProduct>,
      Error,
      ICreateProductInput
    >({
      onSuccess: (data) => {
        // 성공한 상품을 캐시에 추가 (옵티미스틱 업데이트)
        if (data.success && data.data) {
          queryClient.setQueryData(
            queryKeys.products.detail(data.data.id),
            data.data
          );

          // 생성된 상품의 상세 정보도 즉시 무효화하여 최신 데이터 보장
          setTimeout(() => {
            queryClient.invalidateQueries({
              queryKey: queryKeys.products.detail(data.data!.id),
            });
          }, 100); // 약간의 지연 후 무효화
        }

        // 상품 목록 무효화
        invalidationTargets.onProductChange.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      },
    }),
  });
}

/**
 * 상품 수정
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: TUpdateProductInput;
    }) => productsApi.updateProduct(productId, data),
    ...createMutationOptions<
      IProduct,
      Error,
      { productId: string; data: TUpdateProductInput }
    >({
      onSuccess: (updatedProduct, { productId }) => {
        // 수정된 상품 캐시 업데이트
        queryClient.setQueryData(
          queryKeys.products.detail(Number(productId)),
          updatedProduct
        );

        // 상품 목록 무효화
        invalidationTargets.onProductChange.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      },
    }),
  });
}

/**
 * 상품 삭제
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productsApi.deleteProduct(productId),
    ...createMutationOptions<Record<string, unknown>, Error, string>({
      onSuccess: (_, productId) => {
        // 삭제된 상품 캐시에서 제거
        queryClient.removeQueries({
          queryKey: queryKeys.products.detail(Number(productId)),
        });

        // 상품 목록 무효화
        invalidationTargets.onProductChange.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      },
    }),
  });
}

// =============================================================================
// 유틸리티 훅들
// =============================================================================

/**
 * 상품 prefetch (미리 로드)
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return (productId: TId) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(productId),
      queryFn: () => productsApi.getProductById(productId),
      ...STATIC_QUERY_OPTIONS,
    });
  };
}

/**
 * 상품 캐시 무효화
 */
export function useInvalidateProducts() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
    invalidateDetail: (productId: TId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(productId),
      });
    },
  };
}
