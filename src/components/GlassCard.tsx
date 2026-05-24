import React from 'react';
import { useTheme } from '../hooks/useTheme';
import type { GlassCardProps } from '../types';

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick }) => {
  const { bgGlass, borderGlass } = useTheme();
  return (
    <div onClick={onClick} className={`backdrop-blur-md border rounded-2xl ${bgGlass} ${borderGlass} shadow-[0_4px_30px_rgba(0,0,0,0.05)] ${className}`}>
      {children}
    </div>
  );
};
