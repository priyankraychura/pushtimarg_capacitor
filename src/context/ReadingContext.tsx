import { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReadingContextType, ContentIndexItem } from '../types';
import { getAartiIndex, getAartiContent } from '../services/contentService';
import { extractContentError } from '../lib/contentClient';
import { ROUTES } from '../constants/routes';

// ==========================================
// Reading Context
// ==========================================
// Manages the aarti/kirtan index and content fetching.
// Varta is handled separately in CategoryScreen since it has
// a different data structure (vaishnavs → prasangs).

export const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [aartiIndex, setAartiIndex] = useState<ContentIndexItem[]>([]);
  const [recentReadingIds, setRecentReadingIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('recentReadingIds');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [isLoadingIndex, setIsLoadingIndex] = useState<boolean>(true);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [indexRetryCount, setIndexRetryCount] = useState(0);

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [contentError, setContentError] = useState<string | null>(null);

  const navigate = useNavigate();

  // ==========================================
  // Fetch Aarti/Kirtan index on mount
  // ==========================================
  useEffect(() => {
    let cancelled = false;
    setIsLoadingIndex(true);
    setIndexError(null);

    getAartiIndex()
      .then((data) => {
        if (!cancelled) {
          setAartiIndex(data);
          setIsLoadingIndex(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setIndexError(extractContentError(err));
          setIsLoadingIndex(false);
        }
      });

    return () => { cancelled = true; };
  }, [indexRetryCount]);

  const retryIndex = useCallback(() => {
    setIndexRetryCount((c) => c + 1);
  }, []);

  // ==========================================
  // Open an aarti/kirtan item — fetch content then navigate
  // ==========================================
  const handleOpenAarti = useCallback((item: ContentIndexItem) => {
    setIsLoadingContent(true);
    setContentError(null);

    setRecentReadingIds((prev) => {
      const filtered = prev.filter((id) => id !== item.id);
      const updated = [item.id, ...filtered].slice(0, 4);
      localStorage.setItem('recentReadingIds', JSON.stringify(updated));
      return updated;
    });

    getAartiContent(item.file)
      .then((detail) => {
        setIsLoadingContent(false);
        navigate(ROUTES.READ, { state: { item, detail } });
      })
      .catch((err) => {
        setContentError(extractContentError(err));
        setIsLoadingContent(false);
        // Still navigate so user sees the error state on ReadScreen
        navigate(ROUTES.READ, { state: { item } });
      });
  }, [navigate]);

  // ==========================================
  // Context value
  // ==========================================
  const recentReadings = useMemo(() => {
    return recentReadingIds
      .map(id => aartiIndex.find(item => item.id === id))
      .filter((item): item is ContentIndexItem => item !== undefined);
  }, [recentReadingIds, aartiIndex]);

  const value = useMemo<ReadingContextType>(() => ({
    aartiIndex,
    recentReadings,
    isLoadingIndex,
    indexError,
    retryIndex,
    handleOpenAarti,
    isLoadingContent,
    contentError,
  }), [aartiIndex, recentReadings, isLoadingIndex, indexError, retryIndex, handleOpenAarti, isLoadingContent, contentError]);

  return (
    <ReadingContext.Provider value={value}>
      {children}
    </ReadingContext.Provider>
  );
}
