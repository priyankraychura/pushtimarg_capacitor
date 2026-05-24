// ==========================================
// Centralized Environment Configuration
// ==========================================
// All env variables are validated and exported from here.
// Import from this module instead of using import.meta.env directly.

function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Make sure it is defined in your .env file. See .env.example for reference.`
    );
  }
  return value;
}

export const ENV = {
  /** Backend API base URL (e.g. http://localhost:3000/api/v1) */
  API_BASE_URL: requireEnv('VITE_API_BASE_URL'),
} as const;
