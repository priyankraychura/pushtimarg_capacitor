import { createContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { ThemeContextType } from '../types';

// ==========================================
// Theme Context
// ==========================================
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// localStorage keys
const DARK_MODE_KEY = 'pushtimarg_dark_mode';
const FONT_SIZE_KEY = 'pushtimarg_font_size';

function getStoredBoolean(key: string, fallback: boolean): boolean {
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) return JSON.parse(stored);
  } catch {
    // localStorage unavailable or corrupt — use fallback
  }
  return fallback;
}

function getStoredNumber(key: string, fallback: number): number {
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) return JSON.parse(stored);
  } catch {
    // localStorage unavailable or corrupt — use fallback
  }
  return fallback;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() =>
    getStoredBoolean(DARK_MODE_KEY, false)
  );
  const [fontSize, setFontSizeState] = useState<number>(() =>
    getStoredNumber(FONT_SIZE_KEY, 18)
  );

  const setIsDarkMode = (val: boolean) => {
    setIsDarkModeState(val);
    try { localStorage.setItem(DARK_MODE_KEY, JSON.stringify(val)); } catch { /* noop */ }
  };

  const setFontSize = (val: number) => {
    setFontSizeState(val);
    try { localStorage.setItem(FONT_SIZE_KEY, JSON.stringify(val)); } catch { /* noop */ }
  };

  const value = useMemo<ThemeContextType>(() => ({
    isDarkMode, setIsDarkMode,
    fontSize, setFontSize,
  }), [isDarkMode, fontSize]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
