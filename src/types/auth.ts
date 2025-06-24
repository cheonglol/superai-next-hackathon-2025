export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "manager";
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: "admin" | "user" | "manager";
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
  message?: string;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
