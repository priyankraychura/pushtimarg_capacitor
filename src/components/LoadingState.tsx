import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import type { LoadingStateProps } from '../types';

export const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading..." }) => {
  const { isDarkMode, subTextColor } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center mt-10 px-6">
      <Loader2 size={32} className={`animate-spin mb-4 ${isDarkMode ? 'text-blue-400' : 'text-orange-500'}`} />
      <p className={`text-sm font-medium ${subTextColor}`}>{message}</p>
    </div>
  );
};
