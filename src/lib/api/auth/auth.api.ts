import { fetchWithRefresh } from "@/lib/api/auth/fetchWithRefresh";

interface User {
  id: number;
  email: string;
  nickname: string;
  image?: string | null;
}

interface AuthResponse {
  user: User;
}

interface LoginInput {
  email: string;
  password: string;
}

interface SignupInput extends LoginInput {
  nickname: string;
}

const BASE_URL = "http://localhost:5000";

// 토큰을 저장할 변수 - 초기값을 localStorage에서 가져옴
let accessToken: string | null =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

export const setAccessToken = (token: string | null) => {
  try {
    console.log("Setting access token:", token);
    accessToken = token;

    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("accessToken", token);
        // 저장 확인
        const stored = localStorage.getItem("accessToken");
        console.log("Verified stored token:", stored);
        if (stored !== token) {
          console.error("Token storage verification failed");
        }
      } else {
        localStorage.removeItem("accessToken");
        console.log("Access token removed from storage");
      }
    }
  } catch (error) {
    console.error("Error setting access token:", error);
    // 에러 발생 시 다시 한번 시도
    if (typeof window !== "undefined" && token) {
      try {
        localStorage.setItem("accessToken", token);
      } catch (retryError) {
        console.error("Retry failed:", retryError);
      }
    }
  }
};

export const getAccessToken = () => {
  // 항상 최신 값을 보장하기 위해 localStorage에서 직접 가져옴
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// 초기 토큰 확인
export const checkInitialToken = async (): Promise<User | null> => {
  try {
    console.log("Checking initial token...");

    // 항상 먼저 리프레시 토큰으로 새 액세스 토큰 발급 시도
    const refreshResponse = await fetch(`${BASE_URL}/users/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (refreshResponse.ok) {
      const refreshResult = await refreshResponse.json();
      console.log("Got new access token from refresh");
      setAccessToken(refreshResult.accessToken);

      // 새로 받은 액세스 토큰으로 사용자 정보 확인
      const meResponse = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${refreshResult.accessToken}`,
        },
        credentials: "include",
      });

      if (meResponse.ok) {
        console.log("User validation successful");
        const userData = await meResponse.json();
        return userData.user;
      }
    } else {
      console.error("Refresh failed with status:", refreshResponse.status);
      const errorData = await refreshResponse.json().catch(() => ({}));
      console.error("Error details:", errorData);
    }

    // 리프레시 토큰이 없거나 만료된 경우
    console.log("Token refresh failed");
    setAccessToken(null);
    return null;
  } catch (error) {
    console.error("Initial token check failed:", error);
    setAccessToken(null);
    return null;
  }
};

export const login = async (credentials: LoginInput): Promise<AuthResponse> => {
  try {
    const requestData = {
      email: credentials.email,
      encryptedPassword: credentials.password,
    };

    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signup = async (userData: SignupInput): Promise<AuthResponse> => {
  const requestData = {
    email: userData.email,
    encryptedPassword: userData.password,
    nickname: userData.nickname,
  };

  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(requestData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Signup failed");
  }

  return result;
};

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Logout failed with status:", response.status);
    }

    // 로컬 스토리지의 액세스 토큰 제거
    setAccessToken(null);
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // 에러가 발생하더라도 로컬의 토큰은 항상 제거
    setAccessToken(null);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log("[getCurrentUser] Attempting to fetch user data...");

    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("[getCurrentUser] Response status:", response.status);

    if (!response.ok) {
      if (response.status === 401) {
        console.log("[getCurrentUser] Token expired, attempting to refresh...");
        try {
          const refreshResponse = await fetch(`${BASE_URL}/users/refresh`, {
            method: "POST",
            credentials: "include",
          });

          console.log(
            "[getCurrentUser] Refresh response status:",
            refreshResponse.status
          );

          if (!refreshResponse.ok) {
            console.error(
              "[getCurrentUser] Token refresh failed:",
              refreshResponse.status
            );
            return null;
          }

          // After refresh, retry getting user info
          const retryResponse = await fetch(`${BASE_URL}/users/me`, {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          console.log(
            "[getCurrentUser] Retry response status:",
            retryResponse.status
          );

          if (!retryResponse.ok) {
            console.error(
              "[getCurrentUser] Failed to get user info after refresh:",
              retryResponse.status
            );
            return null;
          }

          const retryData = await retryResponse.json();
          console.log(
            "[getCurrentUser] Successfully got user data after refresh:",
            retryData
          );
          return retryData;
        } catch (refreshError) {
          console.error("[getCurrentUser] Refresh failed:", refreshError);
          return null;
        }
      }
      console.error(
        "[getCurrentUser] Failed to get user info:",
        response.status
      );
      return null;
    }

    const result = await response.json();
    console.log("[getCurrentUser] Successfully got user data:", result);
    return result;
  } catch (error) {
    console.error("[getCurrentUser] Error:", error);
    return null;
  }
};

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await fetch(`${BASE_URL}/users/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    console.error("Refresh failed with status:", response.status);
    const errorData = await response.json().catch(() => ({}));
    console.error("Error details:", errorData);
    throw new Error("Token refresh failed");
  }

  const result = await response.json();

  // 새로운 토큰 저장
  setAccessToken(result.accessToken);
  return { accessToken: result.accessToken };
};
