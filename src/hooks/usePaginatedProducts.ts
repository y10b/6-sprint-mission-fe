import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products/productsApi";
import { ProductsResponse, PaginationParams } from "@/types/product";

interface Product {
  id: number;
  name: string;
  price: number;
  images?: string[];
  favoriteCount: number;
  isLiked: boolean;
}

export const usePaginatedProducts = (params: PaginationParams) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};
