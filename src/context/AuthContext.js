"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/features/auth/services/userApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    // 초기 mount 로깅
    useEffect(() => {
        console.log("✅ AuthProvider mounted");
    }, []);

    // 토큰 존재 시 사용자 정보 가져오기
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsInitialized(true);
                return;
            }

            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error("[AuthProvider] getCurrentUser 에러:", error);
                setUser(null);
            } finally {
                setIsInitialized(true);
            }
        };

        initAuth();
    }, []);

    // 로그인한 상태에서 특정 경로에 접근 시 리다이렉트
    useEffect(() => {
        if (!isInitialized || !user) return;

        const redirectPaths = ["/", "/login", "/logout"];
        if (redirectPaths.includes(pathname)) {
            router.replace("/products");
        }
    }, [isInitialized, user, pathname, router]);

    // 로그인 메소드
    const login = useCallback(async ({ accessToken, refreshToken }) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const userData = await getCurrentUser();
        setUser(userData);
    }, []);

    // 로그아웃 메소드
    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isInitialized, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
