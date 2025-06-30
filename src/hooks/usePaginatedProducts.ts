import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products/productsApi";
import { IProductsResponse, IPaginationParams } from "@/types/product";

export const usePaginatedProducts = (params: IPaginationParams) => {
  return useQuery<IProductsResponse>({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};
