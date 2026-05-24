import React, { useState } from 'react';
import { Heart, Download } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useFavorites } from '../hooks/useFavorites';
import { useReading } from '../hooks/useReading';
import { ScreenHeader } from '../components/ScreenHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { BhajanCard } from '../components/BhajanCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { PUSHTIMARG_TEXTS } from '../constants/data';

type LibraryTab = 'favorites' | 'downloads';

export const LibraryScreen: React.FC = () => {
  const { textColor, subTextColor } = useTheme();
  const { favoriteIds } = useFavorites();
  const { isLoadingList, listError, handleRetryList, handleOpenText } = useReading();
  const [libraryTab, setLibraryTab] = useState<LibraryTab>('favorites');
  
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    if (Math.abs(distanceY) > Math.abs(distanceX)) return;
    if (distanceX > 50 && libraryTab === 'favorites') setLibraryTab('downloads');
    if (distanceX < -50 && libraryTab === 'downloads') setLibraryTab('favorites');
  };

  return (
    <>
      <ScreenHeader title="Library" className="!border-none !bg-transparent !shadow-none !pb-0" />
      <SegmentedControl 
        tabs={[{id: 'favorites', label: 'Favorites'}, {id: 'downloads', label: 'Downloads'}]}
        activeId={libraryTab}
        onChange={(id) => setLibraryTab(id as LibraryTab)}
        className="mt-2"
      />

      <main 
        onTouchStart={(e) => { setTouchEnd(null); setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY }); }} 
        onTouchMove={(e) => { setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY }); }} 
        onTouchEnd={onTouchEnd} 
        className="flex-1 overflow-y-auto px-6 pb-36 hide-scrollbar z-20 relative" 
        style={{ maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)' }}
      >
        {isLoadingList ? <LoadingState message="Loading your library..." /> : listError ? <ErrorState message={listError} onRetry={handleRetryList} /> : (
          <div className="space-y-3">
            {libraryTab === 'favorites' ? (
              favoriteIds.length > 0 ? (
                PUSHTIMARG_TEXTS.filter(t => favoriteIds.includes(t.id)).map((item) => <BhajanCard key={item.id} item={item} onClick={handleOpenText} />)
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center mt-10">
                  <Heart size={40} className={`mb-4 ${subTextColor} opacity-50`} />
                  <p className={`font-medium ${textColor}`}>No favorites yet</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center mt-10">
                <Download size={40} className={`mb-4 ${subTextColor} opacity-50`} />
                <p className={`font-medium ${textColor}`}>No downloads yet</p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};
