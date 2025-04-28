import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "@/actions/products";

export const usePaginatedProducts = (params, enabled = true) => {
    const { page, pageSize, orderBy, keyword } = params;
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["products", page, pageSize, orderBy, keyword],
        queryFn: () => getProducts({ page, pageSize, orderBy, keyword }),
        enabled,
        keepPreviousData: true,
        staleTime: 1000 * 5,
        onSuccess: (data) => {
            console.log("Successfully fetched data:", data);

            if (data.products.length > 0) {
                queryClient.prefetchQuery({
                    queryKey: ["products", page + 1, pageSize, orderBy, keyword],
                    queryFn: () => getProducts({ page: page + 1, pageSize, orderBy, keyword }),
                });
            }
        },
        onError: (error) => {
            console.error("Error fetching data:", error);
        },
    });
};
