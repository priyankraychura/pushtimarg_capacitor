// ==========================================
// Content API Client
// ==========================================
// Lightweight axios instance for the static content API.
// No auth required — public CDN-hosted JSON files.
// Keep separate from the auth apiClient to maintain SoC.

import axios from 'axios';
import { ENV } from '../config/env';

// ==========================================
// Instance
// ==========================================
export const contentClient = axios.create({
  baseURL: ENV.CONTENT_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 10_000, // 10 seconds — CDN should be fast
});

// ==========================================
// Error Extraction (content-specific)
// ==========================================
export function extractContentError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to connect. Please check your internet connection.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    if (error.response?.status === 404) {
      return 'Content not found. It may have been moved or removed.';
    }
    if (error.response?.status && error.response.status >= 500) {
      return 'Server error. Please try again later.';
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}
