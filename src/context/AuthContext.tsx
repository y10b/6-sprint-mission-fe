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
import Modal from "@/components/Auth/AuthModal";

interface IAuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (userData: IUser) => void;
  logout: () => Promise<void>;
  fetchUserData: () => Promise<void>;
}

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    // 공개 페이지에서는 API 호출 하지 않음
    const publicPaths = ["/", "/products", "/articles", "/signin", "/signup"];
    const isPublicPath = publicPaths.includes(pathname);

    if (isPublicPath) {
      logger.info(
        "[fetchUserData] 공개 페이지에서는 사용자 정보 조회 건너뜀",
        pathname
      );
      // public 경로에서는 사용자 상태를 초기화하지 않고 API 호출만 생략
      return;
    }

    try {
      logger.info("[fetchUserData] getCurrentUser 호출");
      const userData = await getCurrentUser();

      if (userData) {
        logger.info("[fetchUserData] 사용자 정보 조회 성공:", userData.email);
        setUser(userData);
        logger.setUser(userData.id.toString(), userData.email);
      } else {
        logger.warn("[fetchUserData] 사용자 정보 없음, 로그아웃 상태로 설정");
        setUser(null);
      }
    } catch (error) {
      logger.error("사용자 정보 조회 에러", error);
      setUser(null);
    }
  }, [pathname]);

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
        logger.info("[AuthProvider] 현재 환경:", {
          nodeEnv: process.env.NODE_ENV,
          apiUrl: process.env.NEXT_PUBLIC_API_URL,
          isClient: typeof window !== "undefined",
          pathname: pathname,
        });

        // 인증이 필요하지 않은 페이지들 (목록 페이지만, 상세 페이지 제외)
        const publicPaths = [
          "/",
          "/products",
          "/articles",
          "/signin",
          "/signup",
        ];
        const isPublicPath = publicPaths.includes(pathname);

        if (isPublicPath) {
          logger.info("[AuthProvider] 공개 페이지: 인증 확인 건너뜀", pathname);
          // public 경로에서는 사용자 상태를 초기화하지 않음
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        // 먼저 refresh token으로 새로운 access token 발급 시도
        logger.info("[AuthProvider] checkInitialToken 호출");
        const userData = await checkInitialToken();

        if (userData) {
          logger.info(
            "[AuthProvider] checkInitialToken 성공, 사용자 설정:",
            userData.email
          );
          setUser(userData);
          logger.setUser(userData.id.toString(), userData.email);
        } else {
          // checkInitialToken 실패 시 fallback으로 getCurrentUser 시도
          logger.info(
            "[AuthProvider] checkInitialToken 실패, getCurrentUser 시도"
          );
          await fetchUserData();
        }
      } catch (error) {
        logger.error("인증 초기화 에러", error);
        setUser(null);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
        logger.info("[AuthProvider] 초기화 완료");
      }
    };

    initAuth();
  }, [pathname]); // pathname을 의존성에 추가

  // 인증 권한 확인 및 모달 표시
  useEffect(() => {
    if (!isInitialized) return;

    // 로그인/회원가입 페이지는 로그인 상태에서 접근 불가
    const authOnlyPaths = ["/signin", "/signup"];
    if (user && authOnlyPaths.includes(pathname)) {
      router.replace("/products");
      return;
    }

    // 인증이 필요한 페이지 체크
    const publicPaths = ["/", "/products", "/articles", "/signin", "/signup"];
    const needsAuth = !publicPaths.includes(pathname);

    // 로그인하지 않은 사용자가 인증이 필요한 페이지에 접근한 경우
    if (needsAuth && !user) {
      logger.info("[AuthProvider] 인증이 필요한 페이지 접근:", pathname);
      setShowAuthModal(true);
    }
  }, [isInitialized, user, pathname, router]);

  // 인증 모달 닫기 및 로그인 페이지로 이동
  const handleAuthModalClose = useCallback(() => {
    setShowAuthModal(false);
    router.push("/signin");
  }, [router]);

  // 인증 모달 취소 (이전 페이지로 이동)
  const handleAuthModalCancel = useCallback(() => {
    setShowAuthModal(false);
    router.back();
  }, [router]);

  const value = {
    user,
    isLoading,
    isInitialized,
    login,
    logout,
    fetchUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showAuthModal && (
        <Modal
          message="로그인이 필요한 페이지입니다. 로그인 페이지로 이동하시겠습니까?"
          onClose={handleAuthModalClose}
          onCancel={handleAuthModalCancel}
          showCancel={true}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
