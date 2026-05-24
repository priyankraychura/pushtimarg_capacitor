import { createContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReadingContextType, PushtimargText } from '../types';
import { PUSHTIMARG_TEXTS } from '../constants/data';
import { ROUTES } from '../constants/routes';

// ==========================================
// Reading Context
// ==========================================
export const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

const RECENT_KEY = 'pushtimarg_recent';

function getStoredRecent(): PushtimargText[] {
  try {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // localStorage unavailable or corrupt
  }
  return PUSHTIMARG_TEXTS.slice(0, 4);
}

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [listError, setListError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [recentReadings, setRecentReadings] = useState<PushtimargText[]>(getStoredRecent);
  const navigate = useNavigate();

  const handleOpenText = useCallback((item: PushtimargText) => {
    setContentError(null);
    if (!item.content) setContentError("The divine text could not be loaded.");
    setRecentReadings(prev => {
      const updated = [item, ...prev.filter(t => t.id !== item.id)].slice(0, 4);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated)); } catch { /* noop */ }
      return updated;
    });
    navigate(ROUTES.READ, { state: { item } });
  }, [navigate]);

  const handleRetryList = useCallback(() => {
    setListError(null);
    setIsLoadingList(true);
    setTimeout(() => setIsLoadingList(false), 1000);
  }, []);

  const handleRetryContent = useCallback(() => {
    setContentError(null);
    setIsLoadingContent(true);
    setTimeout(() => setIsLoadingContent(false), 1000);
  }, []);

  const value = useMemo<ReadingContextType>(() => ({
    recentReadings, handleOpenText,
    isLoadingList, listError, handleRetryList,
    isLoadingContent, contentError, handleRetryContent,
  }), [recentReadings, handleOpenText, isLoadingList, listError, handleRetryList, isLoadingContent, contentError, handleRetryContent]);

  return (
    <ReadingContext.Provider value={value}>
      {children}
    </ReadingContext.Provider>
  );
}
