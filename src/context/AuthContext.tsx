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
import { getCurrentUser } from "@/lib/api/auth/auth.api";
import { logout as logoutApi } from "@/lib/api/auth/auth.api";

interface User {
  id: number;
  email: string;
  nickname: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // 사용자 정보 직접 설정
  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  // 사용자 정보 가져오기
  const fetchUserData = useCallback(async () => {
    try {
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

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await logoutApi();
      setUser(null);
      router.replace("/");
    } catch (error) {
      console.error("[AuthProvider] 로그아웃 에러:", error);
    }
  }, [router]);

  // 초기 로드 시 사용자 정보 가져오기
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
