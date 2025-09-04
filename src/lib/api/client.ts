import { IApiResponse, TId } from "@/types";
import { logger } from "@/utils/logger";

/**
 * API 클라이언트 설정
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  API_BASE_URL: (process.env.NEXT_PUBLIC_API_URL || "") + "/api",
  TIMEOUT: 10000,
} as const;

/**
 * 기본 헤더 설정
 */
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

/**
 * 기본 fetch 옵션
 */
const DEFAULT_OPTIONS: RequestInit = {
  credentials: "include",
  headers: DEFAULT_HEADERS,
};

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * 응답 처리 유틸리티
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorData;

    if (isJson) {
      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }
    }

    throw new ApiError(response.status, errorMessage, errorData);
  }

  if (isJson) {
    try {
      const text = await response.text();
      if (!text.trim()) {
        // 빈 응답인 경우 빈 객체 반환
        return {} as T;
      }
      return JSON.parse(text);
    } catch (error) {
      logger.error("JSON 파싱 실패:", error);
      // JSON 파싱 실패 시 빈 객체 반환
      return {} as T;
    }
  }

  // JSON이 아닌 경우 텍스트로 반환
  const text = await response.text();
  return (text || "") as unknown as T;
}

/**
 * 중앙화된 API 클라이언트
 */
export class ApiClient {
  private baseURL: string;
  private defaultOptions: RequestInit;

  constructor(baseURL: string = API_CONFIG.API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultOptions = DEFAULT_OPTIONS;
  }

  /**
   * GET 요청
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      ...options,
    });
  }

  /**
   * POST 요청
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PUT 요청
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PATCH 요청
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * DELETE 요청
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      ...options,
    });
  }

  /**
   * 공통 요청 메서드 (토큰 갱신 로직 포함)
   */
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      logger.info(`API Request: ${config.method} ${url}`);

      let response = await fetch(url, config);

      // 401 에러 시 토큰 갱신 시도
      if (response.status === 401) {
        try {
          logger.info("토큰 만료 감지, 갱신 시도");
          await refreshAccessToken();

          // 토큰 갱신 후 재요청
          response = await fetch(url, config);
        } catch (refreshError) {
          logger.error("토큰 갱신 실패", refreshError);
          throw new ApiError(401, "인증이 필요합니다.");
        }
      }

      const result = await handleResponse<T>(response);

      logger.info(`API Success: ${config.method} ${url}`);
      return result;
    } catch (error) {
      logger.error(`API Error: ${config.method} ${url}`, error);
      throw error;
    }
  }

  /**
   * 쿼리 파라미터 생성 유틸리티
   */
  static createQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }
}

/**
 * 기본 API 클라이언트 인스턴스
 */
export const apiClient = new ApiClient();

/**
 * 인증 전용 API 클라이언트 (BASE_URL 사용)
 */
export const authApiClient = new ApiClient(API_CONFIG.BASE_URL);

/**
 * 토큰 갱신 함수 (쿠키 기반 인증 시스템에 맞게 수정)
 */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/users/refresh`, {
      method: "POST",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("토큰 갱신 실패");
    }

    logger.info("토큰 갱신 성공");
    return true;
  } catch (error) {
    logger.error("토큰 갱신 실패", error);
    throw error;
  }
}

/**
 * 토큰 갱신을 포함한 요청 (쿠키 기반 인증에 맞게 수정)
 */
export async function requestWithRefresh<T>(
  request: () => Promise<T>,
  maxRetries: number = 1
): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && maxRetries > 0) {
      try {
        // 쿠키 기반 토큰 갱신
        await refreshAccessToken();
        return await request();
      } catch (refreshError) {
        logger.error("토큰 갱신 후 재요청 실패", refreshError);
        // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트할 수 있도록 에러 전파
        throw refreshError;
      }
    }
    throw error;
  }
}
