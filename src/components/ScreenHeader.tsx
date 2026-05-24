import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { IconButton } from './IconButton';
import type { ScreenHeaderProps } from '../types';

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, showBack, onBack, rightElement, className = "" }) => {
  const { isDarkMode, textColor, subTextColor, borderGlass } = useTheme();
  const bgStyle = isDarkMode ? 'bg-slate-900/95' : 'bg-orange-50/95';

  return (
    <header className={`shrink-0 z-30 px-6 pt-12 pb-4 shadow-sm border-b transition-colors backdrop-blur-xl ${bgStyle} ${borderGlass} flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        {showBack && <IconButton icon={<ArrowLeft size={20} />} onClick={onBack} />}
        <div className="flex-1 overflow-hidden">
          {typeof title === 'string' ? <h1 className={`text-2xl font-extrabold tracking-tight truncate ${textColor}`}>{title}</h1> : title}
          {subtitle && <p className={`text-sm mt-0.5 font-medium truncate ${subTextColor}`}>{subtitle}</p>}
        </div>
      </div>
      {rightElement && <div className="shrink-0 ml-4">{rightElement}</div>}
    </header>
  );
};
