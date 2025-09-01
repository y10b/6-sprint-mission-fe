/**
 * React Query 라이브러리 중앙 export
 * 모든 쿼리 훅과 유틸리티를 여기서 관리합니다.
 */

// Query Options
export * from "./query-options";

// Query Hooks
export * from "./hooks/use-auth";
export * from "./hooks/use-products";
export * from "./hooks/use-articles";

// Re-export commonly used TanStack Query hooks
export {
  useQuery,
  useMutation,
  useQueryClient,
  useIsFetching,
  useIsMutating,
} from "@tanstack/react-query";

// Re-export types
export type {
  UseQueryResult,
  UseMutationResult,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
