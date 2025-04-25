"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "@/app/api/CUD/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // 앱 시작 시 유저 정보 확인
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        console.log("[AuthProvider] accessToken:", token);
        if (token) {
            getCurrentUser()
                .then((userData) => {
                    console.log("[AuthProvider] userData 받아옴:", userData);
                    setUser(userData);
                    setIsInitialized(true);
                })
                .catch(() => {
                    console.error("[AuthProvider] getCurrentUser 에러:", err);
                    setUser(null);
                    setIsInitialized(true);
                });
        } else {
            console.log("[AuthProvider] 토큰 없음");
            setIsInitialized(true);
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem("accessToken", userData.accessToken);
        localStorage.setItem("refreshToken", userData.refreshToken);
        setUser(userData.user);
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
