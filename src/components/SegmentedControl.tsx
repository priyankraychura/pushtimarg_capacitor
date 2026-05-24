import React from 'react';
import { useTheme } from '../hooks/useTheme';
import type { SegmentedControlProps } from '../types';

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ tabs, activeId, onChange, className = "" }) => {
  const { isDarkMode, subTextColor } = useTheme();
  
  return (
    <div className={`px-6 mb-4 z-20 relative shrink-0 ${className}`}>
      <div className={`flex p-1 rounded-xl ${isDarkMode ? 'bg-black/20' : 'bg-black/5'}`}>
        {tabs.map(tab => {
          const isActive = activeId === tab.id;
          const activeStyle = isActive 
            ? (isDarkMode ? 'bg-white/10 text-amber-300 shadow-sm' : 'bg-white text-orange-600 shadow-sm') 
            : subTextColor;
          return (
            <button 
              key={tab.id}
              onClick={() => onChange(tab.id)} 
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${activeStyle}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
