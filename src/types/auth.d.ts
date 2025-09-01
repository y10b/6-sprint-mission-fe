import { FieldValues } from "react-hook-form";
import {
  IUser,
  ISignupInput,
  ILoginInput,
  IShowPasswordState,
  TId,
} from "./common";

/**
 * 인증 관련 특화 타입 및 인터페이스 정의
 * (공통 타입은 common.d.ts에서 관리)
 */

// === 폼 데이터 타입 ===
export interface ISignupFormData extends FieldValues {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
}

export interface ISigninFormData {
  email: string;
  password: string;
}

// === API 응답 타입 ===
export interface IAuthResponse {
  success: boolean;
  user: IUser;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    user: IUser;
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
  message?: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
}

// === JWT 토큰 관련 타입 ===
export interface IJwtTokenPayload {
  userId: TId;
  email: string;
  nickname: string;
  iat: number;
  exp: number;
}

// === 에러 타입 ===
export interface IAuthError {
  success: false;
  error: string;
  message?: string;
}

// === 토큰 타입 ===
export type TAccessToken = string;
export type TRefreshToken = string;
