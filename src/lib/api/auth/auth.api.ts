import { fetchWithRefresh } from "@/lib/api/auth/fetchWithRefresh";

interface User {
  id: number;
  email: string;
  nickname: string;
  image?: string | null;
}

interface AuthResponse {
  accessToken: string;
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

// 토큰을 저장할 변수
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// 초기 토큰 확인
export const checkInitialToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/users/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const result = await response.json();
      setAccessToken(result.accessToken);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Initial token check failed:", error);
    return false;
  }
};

export const login = async (credentials: LoginInput): Promise<AuthResponse> => {
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

  // 토큰 저장
  setAccessToken(result.accessToken);
  return result;
};

export const signup = async (userData: SignupInput): Promise<AuthResponse> => {
  const requestData = {
    email: userData.email,
    encryptedPassword: userData.password,
    nickname: userData.nickname,
  };

  const response = await fetch(`${BASE_URL}/users/signup`, {
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

  // 토큰 저장
  setAccessToken(result.accessToken);
  return result;
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/users/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  // 토큰 제거
  setAccessToken(null);
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetchWithRefresh(`${BASE_URL}/users/me`, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.user;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await fetch(`${BASE_URL}/users/refresh`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  // 새로운 토큰 저장
  setAccessToken(result.accessToken);
  return { accessToken: result.accessToken };
};
