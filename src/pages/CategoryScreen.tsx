import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useReading } from '../hooks/useReading';
import { ScreenHeader } from '../components/ScreenHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { GlassCard } from '../components/GlassCard';
import { BhajanCard } from '../components/BhajanCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { PUSHTIMARG_TEXTS } from '../constants/data';
import { CATEGORIES } from '../constants/categories';
import { ROUTES } from '../constants/routes';

interface CategoryLocationState {
  categoryName?: string;
}

export const CategoryScreen: React.FC = () => {
  const { isDarkMode, textColor, subTextColor } = useTheme();
  const { isLoadingList, listError, handleRetryList, handleOpenText } = useReading();
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryName } = (location.state as CategoryLocationState | null) ?? {};
  const category = CATEGORIES.find(c => c.name === categoryName);

  const [vartaTab, setVartaTab] = useState<string>('84 Vaishnav');
  
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);

  if (!category) return null;

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || category.name !== 'Varta') return;
    const distanceX = touchStart.x - touchEnd.x;
    if (distanceX > 50 && vartaTab === '84 Vaishnav') setVartaTab('252 Vaishnav');
    if (distanceX < -50 && vartaTab === '252 Vaishnav') setVartaTab('84 Vaishnav');
  };

  let displayItems = PUSHTIMARG_TEXTS.filter(t => t.category === category.name);
  if (category.name === "Varta") displayItems = displayItems.filter(t => t.subCategory === vartaTab);

  return (
    <>
      <ScreenHeader title={category.name} showBack onBack={() => navigate(ROUTES.HOME)} />

      {category.name === "Varta" && (
        <SegmentedControl 
          tabs={[{id: '84 Vaishnav', label: '84 Vaishnav'}, {id: '252 Vaishnav', label: '252 Vaishnav'}]}
          activeId={vartaTab}
          onChange={setVartaTab}
          className="mt-4 mb-2"
        />
      )}

      <main 
        onTouchStart={(e) => { setTouchEnd(null); setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY }); }} 
        onTouchMove={(e) => { setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY }); }} 
        onTouchEnd={onTouchEnd} 
        className="flex-1 overflow-y-auto px-6 pt-4 pb-32 hide-scrollbar z-20 relative"
      >
        {isLoadingList ? <LoadingState message={`Loading ${category.name}...`} /> : listError ? <ErrorState message={listError} onRetry={handleRetryList} /> : (
          <>
            {displayItems.length > 0 ? (
              category.name === 'Pad' ? (
                <div className="grid grid-cols-4 gap-y-6 gap-x-3 pt-2">
                  {displayItems.map((item, idx) => (
                    <div key={item.id} className="flex flex-col items-center space-y-2">
                      <GlassCard onClick={() => handleOpenText(item)} className="w-16 h-16 flex items-center justify-center rounded-[20px] cursor-pointer hover:scale-105 transition-transform shadow-sm">
                        <span className={`text-2xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-orange-600'}`}>{idx + 1}</span>
                      </GlassCard>
                      <span className={`text-[10px] font-medium text-center leading-tight line-clamp-2 px-1 ${textColor}`}>Pad {idx + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {displayItems.map((item) => <BhajanCard key={item.id} item={item} onClick={handleOpenText} />)}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center mt-4">
                <BookOpen size={40} className={`mb-4 ${subTextColor} opacity-50`} />
                <p className={`font-medium ${textColor}`}>No {category.name.toLowerCase()} found</p>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};
