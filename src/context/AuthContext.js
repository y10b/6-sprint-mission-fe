"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/features/auth/services/userApi";
import { logout as logoutApi } from "@/features/auth/services/authApi"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    // 초기 mount 로깅
    useEffect(() => {
        console.log("✅ auth ");
    }, []);

    // 사용자 정보 가져오기 (쿠키 기반)
    useEffect(() => {
        const initAuth = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData) {
                    setUser(userData);
                }
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

        const redirectPaths = ["/", "/signin", "signup"];
        if (redirectPaths.includes(pathname)) {
            router.replace("/products");
        }
    }, [isInitialized, user, pathname, router]);

    // 로그인 메소드 (쿠키 사용 시 별도 저장 불필요)
    const login = useCallback(async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error("[AuthProvider] login 중 getCurrentUser 에러:", error);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutApi(); // logout API 호출
            setUser(null); // 상태에서 사용자 정보 삭제
            router.push("/"); // 로그아웃 후 홈 화면으로 리다이렉트
        } catch (error) {
            console.error("[AuthProvider] 로그아웃 실패:", error);
        }
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, isInitialized, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
