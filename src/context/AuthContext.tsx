"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getCurrentUser,
  getAccessToken,
  checkInitialToken,
} from "@/lib/api/auth/auth.api";
import { logout as logoutApi } from "@/lib/api/auth/auth.api";

interface User {
  id: number;
  email: string;
  nickname: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setUserData: (user: User) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // 사용자 정보 직접 설정
  const setUserData = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  // 사용자 정보 가져오기 (토큰 기반)
  const fetchUserData = useCallback(async () => {
    try {
      // 먼저 토큰이 있는지 확인
      const hasValidToken = await checkInitialToken();
      if (!hasValidToken) {
        setUser(null);
        return;
      }

      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("[AuthProvider] getCurrentUser 에러:", error);
      setUser(null);
    }
  }, []);

  // 초기 로드 시 토큰이 있다면 사용자 정보 가져오기
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        await fetchUserData();
      } catch (error) {
        console.error("[AuthProvider] 초기화 에러:", error);
        setUser(null);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initAuth();
  }, [fetchUserData]);

  // 로그인한 상태에서 특정 경로에 접근 시 리다이렉트
  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ["/", "/signin", "/signup"];
    if (user && publicPaths.includes(pathname)) {
      router.replace("/products");
    }
  }, [isLoading, user, pathname, router]);

  // 로그인 메소드
  const login = useCallback(async () => {
    await fetchUserData();
  }, [fetchUserData]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("[AuthProvider] 로그아웃 실패:", error);
    }
  }, [router]);

  if (isLoading) {
    return null; // 또는 로딩 스피너 컴포넌트
  }

  return (
    <AuthContext.Provider
      value={{ user, isInitialized, login, logout, setUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
