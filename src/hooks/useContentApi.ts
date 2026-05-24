// ==========================================
// Generic Content API Hook
// ==========================================
// Reusable hook for fetching data from the content API.
// Manages loading, error, and retry state automatically.

import { useState, useEffect, useCallback, useRef } from 'react';
import { extractContentError } from '../lib/contentClient';

interface UseContentApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Generic data-fetching hook.
 *
 * @param fetcher - Async function that returns the data
 * @param options.enabled - Whether to run the fetch (default: true)
 *
 * @example
 * const { data, isLoading, error, retry } = useContentApi(() => getAartiIndex());
 */
export function useContentApi<T>(
  fetcher: () => Promise<T>,
  options: { enabled?: boolean } = {},
): UseContentApiResult<T> {
  const { enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Store fetcher in ref to avoid re-triggering on every render
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetcherRef.current()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(extractContentError(err));
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  return { data, isLoading, error, retry };
}
