import type { ReactNode } from 'react';

// ==========================================
// Auth Types (re-exported from dedicated module)
// ==========================================
export type {
  AuthUser,
  AuthResponse,
  AuthState,
  AuthContextType,
  RegisterPayload,
  LoginPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
} from './auth';

// ==========================================
// Domain Types
// ==========================================
export interface PushtimargText {
  id: number;
  title: string;
  author: string;
  category: string;
  subCategory?: string;
  image: string;
  content: string;
}

export interface Category {
  name: string;
  icon: ReactNode;
}

// ==========================================
// Context Types (split by concern)
// ==========================================
export interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  fontSize: number;
  setFontSize: (val: number) => void;
}

export interface FavoritesContextType {
  favoriteIds: number[];
  toggleFavorite: (id: number) => void;
}

export interface ReadingContextType {
  recentReadings: PushtimargText[];
  handleOpenText: (item: PushtimargText) => void;
  isLoadingList: boolean;
  listError: string | null;
  handleRetryList: () => void;
  isLoadingContent: boolean;
  contentError: string | null;
  handleRetryContent: () => void;
}

// ==========================================
// Component Prop Types
// ==========================================
export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

export interface ScreenHeaderProps {
  title?: string | ReactNode;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: ReactNode;
  className?: string;
}

export interface SegmentedControlProps {
  tabs: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export interface SettingsRowProps {
  icon: ReactNode;
  title: string;
  rightElement?: ReactNode;
  onClick?: () => void;
  borderBottom?: boolean;
}

export interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export interface ToggleSwitchProps {
  enabled: boolean;
  onChange: () => void;
}

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export interface LoadingStateProps {
  message?: string;
}

export interface BhajanCardProps {
  item: PushtimargText;
  onClick: (item: PushtimargText) => void;
}

export interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
