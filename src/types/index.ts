import type { ReactNode } from 'react';

// ==========================================
// Content Types (re-exported from dedicated module)
// ==========================================
import type {
  ContentIndexItem,
  VaishnavPrasang,
  VaishnavIndexItem,
  AartiContent,
  VartaContent,
  ContentDetail,
} from './content';

export type {
  ContentIndexItem,
  VaishnavPrasang,
  VaishnavIndexItem,
  AartiContent,
  VartaContent,
  ContentDetail,
};

export { isAartiContent, isVartaContent } from './content';

// ==========================================
// Auth Types (re-exported from dedicated module)
// ==========================================
import type {
  AuthUser,
  AuthResponse,
  AuthState,
  AuthContextType,
  RegisterPayload,
  LoginPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
} from './auth';

export type {
  AuthUser,
  AuthResponse,
  AuthState,
  AuthContextType,
  RegisterPayload,
  LoginPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
};

// ==========================================
// Domain Types
// ==========================================
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
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
}

export interface ReadingContextType {
  aartiIndex: ContentIndexItem[];
  isLoadingIndex: boolean;
  indexError: string | null;
  retryIndex: () => void;
  handleOpenAarti: (item: ContentIndexItem) => void;
  isLoadingContent: boolean;
  contentError: string | null;
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
  item: ContentIndexItem;
  onClick: (item: ContentIndexItem) => void;
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
