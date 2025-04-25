"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/api/CUD/AuthApi";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        console.log("✅ AuthProvider mounted");
    }, []);


    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            getCurrentUser()
                .then((userData) => {
                    setUser(userData);
                    setIsInitialized(true);
                })
                .catch((err) => {
                    console.error("[AuthProvider] getCurrentUser 에러:", err);
                    setUser(null);
                    setIsInitialized(true);
                });
        } else {
            setIsInitialized(true);
        }
    }, []);

    // 로그인한 상태에서 특정 페이지로 진입하면 /products로 리다이렉트
    useEffect(() => {
        const redirectPaths = ["/", "/login", "/logout"];
        if (isInitialized && user && redirectPaths.includes(pathname)) {
            router.replace("/products");
        }
    }, [isInitialized, user, pathname]);

    const login = async (res) => {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);

        const user = await getCurrentUser(); // 정확한 정보 fetch
        setUser(user);
    };


    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isInitialized }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
