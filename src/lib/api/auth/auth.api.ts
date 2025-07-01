import {
  IUser,
  AuthResponse,
  LoginInput,
  SignupInput,
  RefreshTokenResponse,
} from "@/types";
import { logger } from "@/utils/logger";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// localStorage 의존성 제거 - httpOnly 쿠키만 사용
export const setAccessToken = (token: string | null) => {
  // httpOnly 쿠키를 사용하므로 클라이언트에서는 토큰을 직접 관리하지 않음
};

export const getAccessToken = () => {
  // httpOnly 쿠키를 사용하므로 클라이언트에서는 토큰에 접근할 수 없음
  return null;
};

// 초기 토큰 확인
export const checkInitialToken = async (): Promise<IUser | null> => {
  try {
    // 먼저 현재 액세스 토큰으로 사용자 정보 확인 시도
    const meResponse = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (meResponse.ok) {
      const userData = await meResponse.json();
      return userData.user || userData;
    }

    // 현재 토큰이 만료된 경우 리프레시 시도
    const refreshResponse = await fetch(`${BASE_URL}/users/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (refreshResponse.ok) {
      // 새로 받은 액세스 토큰으로 사용자 정보 확인
      const meResponseAfterRefresh = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (meResponseAfterRefresh.ok) {
        const userData = await meResponseAfterRefresh.json();
        return userData.user || userData;
      }
    }

    // 리프레시 토큰이 없거나 만료된 경우
    return null;
  } catch (error) {
    logger.error("토큰 확인 중 오류", error);
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
    logger.error("로그인 오류", error);
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
    logger.error("회원가입 오류", error);
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
      logger.error("로그아웃 실패", new Error(`Status: ${response.status}`));
    }
  } catch (error) {
    logger.error("로그아웃 오류", error);
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
        try {
          const refreshResponse = await fetch(`${BASE_URL}/users/refresh`, {
            method: "POST",
            credentials: "include",
          });

          if (!refreshResponse.ok) {
            logger.error(
              "토큰 갱신 실패",
              new Error(`Status: ${refreshResponse.status}`)
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

          if (!retryResponse.ok) {
            logger.error(
              "갱신 후 사용자 정보 조회 실패",
              new Error(`Status: ${retryResponse.status}`)
            );
            return null;
          }

          const retryData = await retryResponse.json();
          return retryData.user || retryData;
        } catch (refreshError) {
          logger.error("토큰 갱신 중 오류", refreshError);
          return null;
        }
      }
      logger.error(
        "사용자 정보 조회 실패",
        new Error(`Status: ${response.status}`)
      );
      return null;
    }

    const result = await response.json();
    return result.user || result;
  } catch (error) {
    logger.error("사용자 정보 조회 중 오류", error);
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
    const errorData = await response.json().catch(() => ({}));
    logger.error(
      "토큰 갱신 실패",
      new Error(
        `Status: ${response.status}, Details: ${JSON.stringify(errorData)}`
      )
    );
    throw new Error("Token refresh failed");
  }

  const result = await response.json();

  // httpOnly 쿠키로 관리되므로 클라이언트에서 토큰 저장하지 않음
  return { accessToken: "managed-by-httponly-cookies" };
};
