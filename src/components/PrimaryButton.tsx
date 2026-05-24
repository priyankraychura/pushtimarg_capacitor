import React from 'react';
import { useTheme } from '../hooks/useTheme';

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = "", ...props }) => {
  const { primaryGradient } = useTheme();
  return (
    <button {...props} className={`w-full py-4 mt-2 rounded-2xl font-bold text-white shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center ${primaryGradient} ${className}`}>
      {children}
    </button>
  );
};
