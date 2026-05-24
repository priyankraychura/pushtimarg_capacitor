// ==========================================
// Axios Instance & Helpers
// ==========================================
// Pre-configured Axios instance with auth interceptors.
// All API calls should use this instance.

import axios from 'axios';
import type { AxiosError } from 'axios';
import { ENV } from '../config/env';
import { getToken } from './tokenStorage';

// ==========================================
// Instance
// ==========================================
export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000, // 15 seconds
});

// ==========================================
// Request Interceptor — attach JWT token
// ==========================================
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ==========================================
// Response Interceptor — handle 401
// ==========================================
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Dispatch a custom event so AuthContext can react
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  },
);

// ==========================================
// Error Extraction Helper
// ==========================================
// NestJS returns errors in various shapes. This normalizes them.

interface NestErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export function extractApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as NestErrorResponse | undefined;
    if (data?.message) {
      // NestJS validation pipe returns message as an array
      if (Array.isArray(data.message)) {
        return data.message.join('. ');
      }
      return data.message;
    }
    // Fallback to HTTP status text
    if (error.response?.statusText) {
      return error.response.statusText;
    }
    // Network error
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to connect to server. Please check your connection.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}
