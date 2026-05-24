import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import type { FavoritesContextType } from '../types';

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};
