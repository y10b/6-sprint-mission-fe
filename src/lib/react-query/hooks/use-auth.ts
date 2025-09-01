import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IUser,
  ILoginInput,
  ISignupInput,
  IAuthResponse,
  IRefreshTokenResponse,
} from "@/types";
import {
  queryKeys,
  createQueryOptions,
  createMutationOptions,
  REAL_TIME_QUERY_OPTIONS,
} from "../query-options";
import * as authApi from "../../api/auth/auth.api";

/**
 * 인증 관련 React Query 훅들
 */

// =============================================================================
// Query 훅들
// =============================================================================

/**
 * 현재 사용자 정보 조회
 */
export function useCurrentUser(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: () => authApi.getCurrentUser(),
    ...createQueryOptions<IUser | null>({
      ...REAL_TIME_QUERY_OPTIONS,
      enabled,
      // 인증 실패 시에도 에러로 처리하지 않음
      retry: false,
    }),
  });
}

/**
 * 초기 토큰 확인 (앱 시작 시)
 */
export function useInitialAuth(enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKeys.users.me(), "initial"],
    queryFn: () => authApi.checkInitialToken(),
    ...createQueryOptions<IUser | null>({
      staleTime: 0, // 항상 fresh하게 확인
      gcTime: 0, // 캐시하지 않음
      enabled,
      retry: false,
    }),
  });
}

// =============================================================================
// Mutation 훅들
// =============================================================================

/**
 * 로그인
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: ILoginInput) => authApi.login(credentials),
    ...createMutationOptions<IAuthResponse, Error, ILoginInput>({
      onSuccess: (response) => {
        // 로그인 성공 시 사용자 정보 캐시 업데이트
        if (response.success && response.user) {
          queryClient.setQueryData(queryKeys.users.me(), response.user);
        }

        // 모든 인증 관련 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      },
    }),
  });
}

/**
 * 회원가입
 */
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: ISignupInput) => authApi.signup(userData),
    ...createMutationOptions<IAuthResponse, Error, ISignupInput>({
      onSuccess: (response) => {
        // 회원가입 성공 시 사용자 정보 캐시 업데이트
        if (response.success && response.user) {
          queryClient.setQueryData(queryKeys.users.me(), response.user);
        }

        // 모든 인증 관련 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      },
    }),
  });
}

/**
 * 로그아웃
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    ...createMutationOptions<void, Error, void>({
      onSuccess: () => {
        // 로그아웃 시 모든 캐시 클리어
        queryClient.clear();

        // 사용자 정보를 null로 설정
        queryClient.setQueryData(queryKeys.users.me(), null);
      },
      onError: () => {
        // 로그아웃 실패해도 클라이언트에서는 로그아웃 처리
        queryClient.clear();
        queryClient.setQueryData(queryKeys.users.me(), null);
      },
    }),
  });
}

/**
 * 토큰 갱신
 */
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    ...createMutationOptions<IRefreshTokenResponse, Error, void>({
      onSuccess: () => {
        // 토큰 갱신 성공 시 사용자 정보 다시 조회
        queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
      },
      onError: () => {
        // 토큰 갱신 실패 시 로그아웃 처리
        queryClient.setQueryData(queryKeys.users.me(), null);
        queryClient.clear();
      },
    }),
  });
}

// =============================================================================
// 유틸리티 훅들
// =============================================================================

/**
 * 인증 상태 확인
 */
export function useAuthStatus() {
  const { data: user, isLoading, error } = useCurrentUser();

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError: !!error,
  };
}

/**
 * 인증 액션들
 */
export function useAuthActions() {
  const login = useLogin();
  const signup = useSignup();
  const logout = useLogout();
  const refreshToken = useRefreshToken();

  return {
    login: login.mutateAsync,
    signup: signup.mutateAsync,
    logout: logout.mutateAsync,
    refreshToken: refreshToken.mutateAsync,
    isLoading:
      login.isPending ||
      signup.isPending ||
      logout.isPending ||
      refreshToken.isPending,
  };
}

/**
 * 인증 캐시 관리
 */
export function useAuthCache() {
  const queryClient = useQueryClient();

  return {
    clearAuthCache: () => {
      queryClient.removeQueries({ queryKey: queryKeys.users.all });
    },
    updateUserCache: (user: IUser) => {
      queryClient.setQueryData(queryKeys.users.me(), user);
    },
    invalidateAuth: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  };
}
