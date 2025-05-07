import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "@/features/products/services/productsApi";

export const usePaginatedProducts = (params, enabled = true) => {
    const { page, pageSize, orderBy, keyword } = params;
    const queryClient = useQueryClient();

    const fetchProducts = () => getProducts({ page, pageSize, orderBy, keyword });

    const prefetchNextPage = (data) => {
        if (data?.products?.length > 0) {
            queryClient.prefetchQuery({
                queryKey: ["products", page + 1, pageSize, orderBy, keyword],
                queryFn: () => getProducts({ page: page + 1, pageSize, orderBy, keyword }),
            });
        }
    };

    return useQuery({
        queryKey: ["products", page, pageSize, orderBy, keyword],
        queryFn: fetchProducts,
        enabled,
        keepPreviousData: true,
        staleTime: 5000, // 5초
        onSuccess: prefetchNextPage,
        onError: (error) => {
            console.error("[usePaginatedProducts] fetch error:", error);
        },
    });
};
