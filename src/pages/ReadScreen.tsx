import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Type, Heart, Download, Minus, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useFavorites } from '../hooks/useFavorites';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import type { ContentIndexItem, AartiContent, VartaContent } from '../types';
import { isAartiContent } from '../types';

interface ReadLocationState {
  item?: ContentIndexItem;
  detail?: AartiContent | VartaContent;
  contentError?: string;
}

export const ReadScreen: React.FC = () => {
  const { isDarkMode, fontSize, setFontSize, textColor, subTextColor, borderGlass, bgGlassHover } = useTheme();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const state = (location.state as ReadLocationState | null);
  const item = state?.item;
  const detail = state?.detail;
  const errorMsg = state?.contentError ?? null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false); };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  if (!item) return null;

  const isFavorite = favoriteIds.includes(item.id);

  // Render content based on type
  const renderContent = () => {
    if (errorMsg) return <ErrorState message={errorMsg} />;
    if (!detail) return <LoadingState message="Loading divine text..." />;

    if (isAartiContent(detail)) {
      // Aarti: content is string[] — render each line
      return (
        <div
          className={`font-medium leading-[2.2] text-center transition-all duration-300 ${textColor}`}
          style={{ fontSize: fontSize + 'px' }}
        >
          {detail.content.map((line, idx) => (
            <p key={idx} className={line.trim() === '' ? 'h-4' : ''}>
              {line}
            </p>
          ))}
        </div>
      );
    }

    // Varta: content is a single string
    return (
      <div
        className={`font-medium leading-[2.2] text-center whitespace-pre-wrap transition-all duration-300 ${textColor}`}
        style={{ fontSize: fontSize + 'px' }}
      >
        {detail.content}
      </div>
    );
  };

  return (
    <>
      <ScreenHeader 
        showBack onBack={() => navigate(-1)}
        title={
          <div className="flex flex-col justify-center">
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isDarkMode ? 'text-blue-400' : 'text-orange-600'}`}>{item.category}</span>
            <span className={`text-base font-bold truncate ${textColor}`}>{item.title}</span>
          </div>
        }
        rightElement={
          <div className="relative" ref={menuRef}>
            <IconButton icon={<MoreVertical size={20} />} onClick={() => setIsMenuOpen(!isMenuOpen)} />
            {isMenuOpen && (
              <div className={`absolute right-0 top-full mt-2 w-64 z-50 flex flex-col p-2 shadow-2xl rounded-2xl border ${isDarkMode ? 'bg-[#1c2333] border-slate-700/40' : 'bg-white border-black/5'}`}>
                <div className={`flex items-center justify-between px-3 py-3 border-b ${borderGlass}`}>
                  <div className="flex items-center gap-2"><Type size={16} className={subTextColor} /><span className={`text-sm font-semibold ${textColor}`}>Text Size</span></div>
                  <div className="flex items-center gap-2">
                    <IconButton icon={<Minus size={14} />} onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="!p-1.5 w-7 h-7" />
                    <span className={`font-bold text-xs w-4 text-center ${textColor}`}>{fontSize}</span>
                    <IconButton icon={<Plus size={14} />} onClick={() => setFontSize(Math.min(36, fontSize + 2))} className="!p-1.5 w-7 h-7" />
                  </div>
                </div>
                <button onClick={() => { toggleFavorite(item.id); setIsMenuOpen(false); }} className={`flex items-center gap-3 px-3 py-3 w-full text-left transition-colors rounded-lg border-b ${borderGlass} ${bgGlassHover}`}>
                  <Heart size={16} className={isFavorite ? 'text-red-500' : subTextColor} fill={isFavorite ? "currentColor" : "none"} />
                  <span className={`text-sm font-semibold ${textColor}`}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </button>
                <button onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 w-full text-left transition-colors rounded-lg ${bgGlassHover}`}>
                  <Download size={16} className={subTextColor} /><span className={`text-sm font-semibold ${textColor}`}>Download Offline</span>
                </button>
              </div>
            )}
          </div>
        }
      />
      <main className="flex-1 overflow-y-auto px-6 pt-8 pb-12 hide-scrollbar relative">
        {renderContent()}
        {detail && (
          <div className="flex flex-col items-center mt-16 mb-8">
            <div className={`h-px w-16 mb-6 rounded-full ${isDarkMode ? 'bg-blue-400/40' : 'bg-orange-300'}`}></div>
            <p className={`text-lg font-bold tracking-wide ${textColor}`}>Jai Shree Krishna</p>
          </div>
        )}
      </main>
    </>
  );
};
