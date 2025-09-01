"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DEFAULT_QUERY_OPTIONS } from "@/lib/react-query/query-options";

interface IQueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: IQueryProviderProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            ...DEFAULT_QUERY_OPTIONS,
            // 네트워크 에러 시 자동 재시도
            retry: (failureCount, error: any) => {
              // 401, 403은 재시도하지 않음
              if (error?.status === 401 || error?.status === 403) {
                return false;
              }
              // 3번까지 재시도
              return failureCount < 3;
            },
            // 에러 발생 시 전역 처리
            onError: (error) => {
              console.error("Global Query Error:", error);
              // 여기에 토스트 알림 등 추가 가능
            },
          },
          mutations: {
            // 뮤테이션 에러 발생 시 전역 처리
            onError: (error) => {
              console.error("Global Mutation Error:", error);
              // 여기에 토스트 알림 등 추가 가능
            },
            // 뮤테이션 재시도 설정
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}
