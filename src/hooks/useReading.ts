import { useContext } from 'react';
import { ReadingContext } from '../context/ReadingContext';
import type { ReadingContextType } from '../types';

export const useReading = (): ReadingContextType => {
  const context = useContext(ReadingContext);
  if (!context) throw new Error("useReading must be used within a ReadingProvider");
  return context;
};
