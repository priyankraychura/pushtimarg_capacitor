// ==========================================
// Route Path Constants
// ==========================================

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  LIBRARY: '/library',
  SETTINGS: '/settings',
  LOGIN: '/login',
  CATEGORY: '/category',
  READ: '/read',
  CALENDAR: '/calendar',
  PROFILE: '/profile',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

// Type for route values
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
