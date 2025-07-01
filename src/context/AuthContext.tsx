"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, checkInitialToken } from "@/lib/api/auth/auth.api";
import { logout as logoutApi } from "@/lib/api/auth/auth.api";
import { logger } from "@/utils/logger";
import { IUser } from "@/types";

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (userData: IUser) => void;
  logout: () => Promise<void>;
  fetchUserData: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // 사용자 정보 직접 설정
  const login = useCallback((userData: IUser) => {
    setUser(userData);
    // Sentry에 사용자 컨텍스트 설정
    logger.setUser(userData.id.toString(), userData.email);
  }, []);

  // 사용자 정보 가져오기
  const fetchUserData = useCallback(async () => {
    try {
      const userData = await getCurrentUser();

      if (userData) {
        setUser(userData);
        logger.setUser(userData.id.toString(), userData.email);
      } else {
        setUser(null);
      }
    } catch (error) {
      logger.error("사용자 정보 조회 에러", error);
      setUser(null);
    }
  }, []);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await logoutApi();
      setUser(null);
      // Sentry에서 사용자 정보 제거
      logger.setUser("", "");
      router.replace("/");
    } catch (error) {
      logger.error("로그아웃 에러", error);
    }
  }, [router]);

  // 초기 로드 시 토큰 확인 및 사용자 정보 가져오기
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        logger.info("[AuthProvider] 초기화 시작...");

        // 먼저 refresh token으로 새로운 access token 발급 시도
        const userData = await checkInitialToken();

        if (userData) {
          setUser(userData);
          logger.setUser(userData.id.toString(), userData.email);
        } else {
          // checkInitialToken 실패 시 fallback으로 getCurrentUser 시도
          await fetchUserData();
        }
      } catch (error) {
        logger.error("인증 초기화 에러", error);
        setUser(null);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []); // fetchUserData 의존성 제거하여 무한 루프 방지

  // 로그인한 상태에서 특정 경로에 접근 시 리다이렉트
  useEffect(() => {
    if (!isInitialized) return;

    const publicPaths = ["/", "/signin", "/signup"];
    if (user && publicPaths.includes(pathname)) {
      router.replace("/products");
    }
  }, [isInitialized, user, pathname, router]);

  const value = {
    user,
    isLoading,
    isInitialized,
    login,
    logout,
    fetchUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
