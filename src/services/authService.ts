// ==========================================
// Auth API Service
// ==========================================
// Pure functions — no React dependencies.
// Handles all HTTP calls to the auth endpoints.

import { apiClient } from '../lib/axios';
import type {
  AuthResponse,
  AuthUser,
  RegisterPayload,
  LoginPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
} from '../types/auth';

// ==========================================
// Health
// ==========================================
export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await apiClient.get<{ status: string }>('/health');
  return data;
}

// ==========================================
// Registration & Login
// ==========================================
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
}

// ==========================================
// Current User
// ==========================================
export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>('/auth/me');
  return data;
}

// ==========================================
// Email Verification
// ==========================================
export async function verifyEmail(token: string): Promise<{ verified: boolean }> {
  const { data } = await apiClient.get<{ verified: boolean }>(
    `/auth/verify-email?token=${encodeURIComponent(token)}`,
  );
  return data;
}

// ==========================================
// Password Reset Flow
// ==========================================
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  return data;
}

export async function verifyPasswordResetOtp(
  payload: VerifyOtpPayload,
): Promise<{ resetToken: string }> {
  const { data } = await apiClient.post<{ resetToken: string }>(
    '/auth/verify-password-reset-otp',
    payload,
  );
  return data;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<{ reset: boolean }> {
  const { data } = await apiClient.post<{ reset: boolean }>('/auth/reset-password', payload);
  return data;
}
