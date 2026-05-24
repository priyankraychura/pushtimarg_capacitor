import React from 'react';
import { useTheme } from '../hooks/useTheme';
import type { IconButtonProps } from '../types';

export const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, className = "", isActive }) => {
  const { isDarkMode, primaryText } = useTheme();
  const defaultStyle = isDarkMode ? 'bg-white/10 text-amber-200 hover:bg-white/20' : 'bg-white/80 text-orange-600 hover:bg-white';
  const activeStyle = isActive ? primaryText : '';
  
  return (
    <button onClick={onClick} className={`p-2.5 rounded-2xl shrink-0 transition-all backdrop-blur-md shadow-sm flex items-center justify-center ${defaultStyle} ${activeStyle} ${className}`}>
      {icon}
    </button>
  );
};
