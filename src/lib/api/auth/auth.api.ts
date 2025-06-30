import {
  IUser,
  AuthResponse,
  LoginInput,
  SignupInput,
  RefreshTokenResponse,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_AUTH;

// localStorage 의존성 제거 - httpOnly 쿠키만 사용
export const setAccessToken = (token: string | null) => {
  // httpOnly 쿠키를 사용하므로 클라이언트에서는 토큰을 직접 관리하지 않음
  console.log("Token is managed by httpOnly cookies");
};

export const getAccessToken = () => {
  // httpOnly 쿠키를 사용하므로 클라이언트에서는 토큰에 접근할 수 없음
  console.log("Token is managed by httpOnly cookies");
  return null;
};

// 초기 토큰 확인
export const checkInitialToken = async (): Promise<IUser | null> => {
  try {
    console.log("🚀 [checkInitialToken] 시작...");
    console.log("🔗 [checkInitialToken] BASE_URL:", BASE_URL);

    // 먼저 현재 액세스 토큰으로 사용자 정보 확인 시도
    console.log(
      "📋 [checkInitialToken] 현재 토큰으로 사용자 정보 확인 시도..."
    );
    const meResponse = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    console.log(
      "📋 [checkInitialToken] /users/me 응답 상태:",
      meResponse.status
    );

    if (meResponse.ok) {
      console.log("✅ [checkInitialToken] 현재 토큰이 유효함");
      const userData = await meResponse.json();
      console.log("👤 [checkInitialToken] 사용자 데이터:", userData);
      return userData.user || userData;
    }

    // 현재 토큰이 만료된 경우 리프레시 시도
    console.log("🔄 [checkInitialToken] 현재 토큰 만료, 리프레시 시도...");
    const refreshResponse = await fetch(`${BASE_URL}/users/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log(
      "🔄 [checkInitialToken] refresh 응답 상태:",
      refreshResponse.status
    );

    if (refreshResponse.ok) {
      console.log("✅ [checkInitialToken] 토큰 갱신 성공");

      // 새로 받은 액세스 토큰으로 사용자 정보 확인
      console.log(
        "📋 [checkInitialToken] 갱신된 토큰으로 사용자 정보 재시도..."
      );
      const meResponseAfterRefresh = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      console.log(
        "📋 [checkInitialToken] 갱신 후 /users/me 응답 상태:",
        meResponseAfterRefresh.status
      );

      if (meResponseAfterRefresh.ok) {
        console.log("✅ [checkInitialToken] 갱신 후 사용자 검증 성공");
        const userData = await meResponseAfterRefresh.json();
        console.log("👤 [checkInitialToken] 갱신 후 사용자 데이터:", userData);
        return userData.user || userData;
      } else {
        console.error(
          "❌ [checkInitialToken] 갱신 후 사용자 검증 실패:",
          meResponseAfterRefresh.status
        );
        const errorText = await meResponseAfterRefresh.text();
        console.error("❌ [checkInitialToken] 갱신 후 에러 내용:", errorText);
      }
    } else {
      console.error(
        "❌ [checkInitialToken] 리프레시 실패:",
        refreshResponse.status
      );
      const errorData = await refreshResponse.json().catch(() => ({}));
      console.error("❌ [checkInitialToken] 리프레시 에러 내용:", errorData);
    }

    // 리프레시 토큰이 없거나 만료된 경우
    console.log("⚠️ [checkInitialToken] 토큰 갱신 실패 - 재로그인 필요");
    return null;
  } catch (error) {
    console.error("💥 [checkInitialToken] 예외 발생:", error);
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
      throw new Error(
        result.error ||
          result.message ||
          "이메일 또는 비밀번호가 일치하지 않습니다."
      );
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signup = async (userData: SignupInput): Promise<AuthResponse> => {
  try {
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
      throw new Error(result.error || result.message || "Signup failed");
    }

    return result;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
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

    console.log("Logout successful - httpOnly cookies cleared by server");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const getCurrentUser = async (): Promise<IUser | null> => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

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
          // 백엔드에서 user 객체가 직접 반환되는지 확인
          return retryData.user || retryData;
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
    // 백엔드에서 user 객체가 직접 반환되는지 확인
    return result.user || result;
  } catch (error) {
    console.error("[getCurrentUser] Error:", error);
    return null;
  }
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
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

  // httpOnly 쿠키로 관리되므로 클라이언트에서 토큰 저장하지 않음
  console.log("Token refreshed successfully via httpOnly cookies");
  return { accessToken: "managed-by-httponly-cookies" };
};
