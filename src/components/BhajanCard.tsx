import React from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { GlassCard } from './GlassCard';
import { IconButton } from './IconButton';
import { CATEGORIES } from '../constants/categories';
import type { BhajanCardProps } from '../types';

export const BhajanCard: React.FC<BhajanCardProps> = ({ item, onClick }) => {
  const { isDarkMode, textColor, subTextColor } = useTheme();
  return (
    <GlassCard onClick={() => onClick(item)} className="p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform duration-300">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-black/5'}`}>
        {CATEGORIES.find(c => c.name === item.category)?.icon || <BookOpen size={24} className={subTextColor} />}
      </div>
      <div className="flex-1 overflow-hidden">
        <h4 className={`font-semibold text-sm ${textColor}`}>{item.title}</h4>
        <p className={`text-xs mt-0.5 ${subTextColor}`}>{item.artist} {item.category && `• ${item.category}`}</p>
      </div>
      <IconButton icon={<ChevronRight size={20} />} className="!bg-transparent" />
    </GlassCard>
  );
};
