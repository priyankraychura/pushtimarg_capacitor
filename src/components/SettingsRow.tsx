import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import type { SettingsRowProps } from '../types';

export const SettingsRow: React.FC<SettingsRowProps> = ({ icon, title, rightElement, onClick, borderBottom = true }) => {
  const { textColor, subTextColor, borderGlass, bgGlassHover } = useTheme();
  return (
    <div onClick={onClick} className={`px-4 py-4 flex items-center justify-between transition-colors ${onClick ? 'cursor-pointer' : ''} ${bgGlassHover} ${borderBottom ? `border-b ${borderGlass}` : ''}`}>
      <div className="flex items-center gap-3">
        <span className={subTextColor}>{icon}</span>
        <span className={`font-semibold text-sm ${textColor}`}>{title}</span>
      </div>
      <div>{rightElement || (onClick && <ChevronRight size={18} className={subTextColor} />)}</div>
    </div>
  );
};
