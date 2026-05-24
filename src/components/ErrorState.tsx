import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import type { ErrorStateProps } from '../types';

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const { isDarkMode, textColor, subTextColor } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center mt-10 px-6">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
        <AlertTriangle size={28} className={isDarkMode ? 'text-red-400' : 'text-red-500'} />
      </div>
      <p className={`font-medium ${textColor}`}>Oops! Something went wrong</p>
      <p className={`text-sm mt-1 mb-6 max-w-[250px] mx-auto ${subTextColor}`}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-transform active:scale-95 ${isDarkMode ? 'bg-slate-700/50 text-slate-100 hover:bg-slate-700/70' : 'bg-black/5 text-slate-800 hover:bg-black/10'}`}>
          <RefreshCw size={16} /> Try Again
        </button>
      )}
    </div>
  );
};
