import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../types/auth';

// Extended type to include client-side profile image features
interface UseAuthReturn extends AuthContextType {
  profileImage: string | null;
  updateProfileImage: (img: string) => void;
}

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context as UseAuthReturn;
};
