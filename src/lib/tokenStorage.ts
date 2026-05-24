// ==========================================
// Token Storage
// ==========================================
// Single source of truth for JWT access token persistence.
// Used by the Axios interceptor and AuthContext.

const TOKEN_KEY = 'pushtimarg_access_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage unavailable (e.g. private browsing in some browsers)
  }
}

export function removeToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage unavailable
  }
}
