import { createContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { FavoritesContextType } from '../types';

// ==========================================
// Favorites Context
// ==========================================
export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = 'pushtimarg_favorites';

function getStoredFavorites(): number[] {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // localStorage unavailable or corrupt
  }
  return [];
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(getStoredFavorites);

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs)); } catch { /* noop */ }
      return newFavs;
    });
  }, []);

  const value = useMemo<FavoritesContextType>(() => ({
    favoriteIds, toggleFavorite,
  }), [favoriteIds, toggleFavorite]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
