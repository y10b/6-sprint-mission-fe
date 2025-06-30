import { FieldValues } from "react-hook-form";
import { BaseEntity } from "./index";

// === 사용자 관련 타입 ===
export interface IUser extends BaseEntity {
  email: string;
  nickname: string;
  image?: string | null;
}

// === 폼 데이터 타입 ===
export interface SignupFormData extends FieldValues {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
}

export interface SigninFormData {
  email: string;
  password: string;
}

export interface ShowPasswordState {
  password: boolean;
  passwordConfirmation: boolean;
}

// === API 입력 타입 ===
export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput extends LoginInput {
  nickname: string;
}

// === API 응답 타입 ===
export interface AuthResponse {
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

export interface RefreshTokenResponse {
  accessToken: string;
}

// === JWT 토큰 관련 타입 ===
export interface TokenPayload {
  userId: number;
  email: string;
  nickname: string;
  iat: number;
  exp: number;
}

// === 에러 타입 ===
export interface AuthError {
  success: false;
  error: string;
  message?: string;
}
