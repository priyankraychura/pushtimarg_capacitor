// ==========================================
// Auth Types
// ==========================================
// All auth-related TypeScript types in one place.

/** User object returned by the backend */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}

/** Response from /auth/register and /auth/login */
export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

/** Frontend auth state shape */
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ==========================================
// Request Payloads
// ==========================================

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  password: string;
}

// ==========================================
// Context Type
// ==========================================

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
