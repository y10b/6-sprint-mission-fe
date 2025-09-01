/**
 * @deprecated 이제 useProducts를 사용하세요: import { useProducts } from "@/lib/react-query";
 */
import { useProducts } from "@/lib/react-query";
import { IPaginationParams } from "@/types/product";

export const usePaginatedProducts = (params: IPaginationParams) => {
  return useProducts(params);
};
