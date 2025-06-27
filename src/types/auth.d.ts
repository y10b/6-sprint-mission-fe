export interface SignupFormData extends FieldValues {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
}

export interface ShowPasswordState {
  password: boolean;
  passwordConfirmation: boolean;
}

export interface ApiErrorResponse {
  success: boolean;
  error: string;
  message?: string;
}

export interface SigninFormData {
  email: string;
  password: string;
}

export interface ApiErrorResponse {
  success: boolean;
  error: string;
  message?: string;
}
