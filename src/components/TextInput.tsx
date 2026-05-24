import React from 'react';
import { useTheme } from '../hooks/useTheme';
import type { TextInputProps } from '../types';

export const TextInput: React.FC<TextInputProps> = ({ label, icon, rightElement, className = "", ...props }) => {
  const { isDarkMode, textColor, subTextColor, borderGlass } = useTheme();
  const containerBg = isDarkMode ? 'bg-slate-800/40 focus-within:border-blue-500/50' : 'bg-white/60 focus-within:border-orange-400/50';
  
  return (
    <div className="w-full">
      {label && <label className={`block text-[11px] font-bold uppercase tracking-widest mb-2 ml-1 ${subTextColor}`}>{label}</label>}
      <div className={`flex items-center px-4 py-3.5 rounded-2xl border transition-colors ${containerBg} ${borderGlass}`}>
        {icon && <span className={`mr-3 ${subTextColor}`}>{icon}</span>}
        <input 
          {...props} 
          className={`bg-transparent border-none outline-none w-full text-sm font-medium placeholder-opacity-60 ${textColor} placeholder-${isDarkMode ? 'slate-500' : 'slate-400'} ${className}`} 
        />
        {rightElement && <div className="ml-2">{rightElement}</div>}
      </div>
    </div>
  );
};
