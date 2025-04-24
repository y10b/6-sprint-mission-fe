import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/actions/products";

export const usePaginatedProducts = (params, enabled = true) => {
    const { page, pageSize, orderBy, keyword } = params;

    return useQuery({
        queryKey: ["products", page],
        queryFn: () => getProducts({ page, pageSize, orderBy, keyword }),
        enabled,
    });
};
