import { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthContextType, AuthUser } from '../types/auth';
import { ROUTES } from '../constants/routes';
import { getToken, setToken, removeToken } from '../lib/tokenStorage';
import { extractApiError } from '../lib/axios';
import * as authService from '../services/authService';

// ==========================================
// Auth Context
// ==========================================
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Profile image is stored separately (client-side only, no backend endpoint yet)
const PROFILE_IMAGE_KEY = 'pushtimarg_profile_image';

function getStoredProfileImage(): string | null {
  try {
    return localStorage.getItem(PROFILE_IMAGE_KEY);
  } catch {
    return null;
  }
}

function persistProfileImage(image: string | null) {
  try {
    if (image) {
      localStorage.setItem(PROFILE_IMAGE_KEY, image);
    } else {
      localStorage.removeItem(PROFILE_IMAGE_KEY);
    }
  } catch {
    // localStorage unavailable
  }
}

// ==========================================
// Provider
// ==========================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profileImage, setProfileImage] = useState<string | null>(getStoredProfileImage);
  const navigate = useNavigate();

  // ------------------------------------------
  // Session Restoration on Mount
  // ------------------------------------------
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    authService
      .getCurrentUser()
      .then((userData) => {
        if (!cancelled) {
          setUser(userData);
        }
      })
      .catch(() => {
        // Token is invalid/expired — clear it
        if (!cancelled) {
          removeToken();
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ------------------------------------------
  // Listen for 401 events from Axios interceptor
  // ------------------------------------------
  useEffect(() => {
    const handleUnauthorized = () => {
      removeToken();
      setUser(null);
      persistProfileImage(null);
      setProfileImage(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // ------------------------------------------
  // Auth Actions
  // ------------------------------------------
  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await authService.register({ name, email, password });
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    persistProfileImage(null);
    setProfileImage(null);
    navigate(ROUTES.HOME);
  }, [navigate]);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch {
      // If the request fails, don't touch existing state
    }
  }, []);

  // ------------------------------------------
  // Profile Image (client-side only)
  // ------------------------------------------
  const updateProfileImage = useCallback((imageUrl: string) => {
    setProfileImage(imageUrl);
    persistProfileImage(imageUrl);
  }, []);

  // ------------------------------------------
  // Context Value
  // ------------------------------------------
  const value = useMemo<AuthContextType & { profileImage: string | null; updateProfileImage: (img: string) => void }>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      profileImage,
      updateProfileImage,
    }),
    [user, isLoading, login, register, logout, refreshUser, profileImage, updateProfileImage],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Re-export extractApiError for convenient access from pages
export { extractApiError };
