import {
  IUser,
  IAuthResponse,
  ILoginInput,
  ISignupInput,
  IRefreshTokenResponse,
} from "@/types";
import { logger } from "@/utils/logger";
import { authApiClient, ApiError } from "../client";

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
    logger.info("[checkInitialToken] 시작");

    // 먼저 현재 액세스 토큰으로 사용자 정보 확인 시도
    logger.info("[checkInitialToken] /users/me 호출 시도");
    const userData = await authApiClient.get<{ user: IUser }>("/users/me");

    logger.info("[checkInitialToken] 현재 토큰으로 사용자 정보 획득 성공");
    return userData.user || userData;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      try {
        // 현재 토큰이 만료된 경우 리프레시 시도
        logger.info("[checkInitialToken] 액세스 토큰 만료, 리프레시 시도");
        await authApiClient.post("/users/refresh");

        // 새로 받은 액세스 토큰으로 사용자 정보 확인
        logger.info("[checkInitialToken] 토큰 갱신 성공, 사용자 정보 재조회");
        const refreshedUserData = await authApiClient.get<{ user: IUser }>(
          "/users/me"
        );

        logger.info("[checkInitialToken] 토큰 갱신 후 사용자 정보 획득 성공");
        return refreshedUserData.user || refreshedUserData;
      } catch (refreshError) {
        logger.warn(
          "[checkInitialToken] 토큰 갱신 실패 또는 리프레시 토큰 없음"
        );
        return null;
      }
    }

    logger.error("토큰 확인 중 오류", error);
    return null;
  }
};

export const login = async (
  credentials: ILoginInput
): Promise<IAuthResponse> => {
  try {
    const requestData = {
      email: credentials.email,
      encryptedPassword: credentials.password,
    };

    const result = await authApiClient.post<IAuthResponse>(
      "/users/login",
      requestData
    );
    return result;
  } catch (error) {
    logger.error("로그인 오류", error);
    throw error;
  }
};

export const signup = async (
  userData: ISignupInput
): Promise<IAuthResponse> => {
  try {
    const requestData = {
      email: userData.email,
      encryptedPassword: userData.password,
      nickname: userData.nickname,
    };

    const result = await authApiClient.post<IAuthResponse>(
      "/users/register",
      requestData
    );
    return result;
  } catch (error) {
    logger.error("회원가입 오류", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await authApiClient.post("/users/logout");
  } catch (error) {
    logger.error("로그아웃 오류", error);
    // 로그아웃은 실패해도 클라이언트에서 계속 진행
  }
};

export const getCurrentUser = async (): Promise<IUser | null> => {
  try {
    logger.info("[getCurrentUser] 시작");

    const userData = await authApiClient.get<{ user: IUser }>("/users/me");
    logger.info("[getCurrentUser] 사용자 정보 조회 성공");
    return userData.user || userData;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      try {
        logger.info("[getCurrentUser] 401 에러, 토큰 갱신 시도");
        await authApiClient.post("/users/refresh");

        logger.info("[getCurrentUser] 토큰 갱신 성공, 사용자 정보 재조회");
        const refreshedUserData = await authApiClient.get<{ user: IUser }>(
          "/users/me"
        );

        logger.info("[getCurrentUser] 갱신 후 사용자 정보 조회 성공");
        return refreshedUserData.user || refreshedUserData;
      } catch (refreshError) {
        logger.error("[getCurrentUser] 토큰 갱신 중 오류:", refreshError);
        return null;
      }
    }

    logger.error("[getCurrentUser] 오류:", error);
    return null;
  }
};

export const refreshToken = async (): Promise<IRefreshTokenResponse> => {
  try {
    await authApiClient.post("/users/refresh");

    // httpOnly 쿠키로 관리되므로 클라이언트에서 토큰 저장하지 않음
    return { accessToken: "managed-by-httponly-cookies" };
  } catch (error) {
    logger.error("토큰 갱신 실패", error);
    throw error;
  }
};
