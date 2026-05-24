import React from 'react';
import { useTheme } from '../hooks/useTheme';
import type { ToggleSwitchProps } from '../types';

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => {
  const { isDarkMode } = useTheme();
  return (
    <div onClick={onChange} className={`w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-colors duration-300 ${enabled ? (isDarkMode ? 'bg-amber-500' : 'bg-orange-500') : (isDarkMode ? 'bg-white/20' : 'bg-black/10')}`}>
      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
  );
};
