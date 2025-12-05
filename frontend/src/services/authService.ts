// src/services/authService.ts
import api from "./api";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  username?: string;
  fullName?: string;
  email?: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", {
    username,
    password,
  });

  // BE trả { token, role, username (optional), fullName (optional), email (optional) }
  return res.data;
};

// Kiểm tra token có hợp lệ không
export const verifyToken = async (): Promise<boolean> => {
  try {
    await api.get("/auth/verify");
    return true;
  } catch {
    return false;
  }
};

// Đăng xuất
export const logout = (): void => {
  localStorage.clear();
};