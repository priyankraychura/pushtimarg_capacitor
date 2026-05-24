import React, { useState, useMemo, useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useReading } from '../hooks/useReading';
import { useContentApi } from '../hooks/useContentApi';
import { ScreenHeader } from '../components/ScreenHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { GlassCard } from '../components/GlassCard';
import { BhajanCard } from '../components/BhajanCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { CATEGORIES } from '../constants/categories';
import { ROUTES } from '../constants/routes';
import { getVarta84Index, getVarta252Index, getVartaContent } from '../services/contentService';
import { extractContentError } from '../lib/contentClient';
import type { VaishnavIndexItem, ContentIndexItem } from '../types';

interface CategoryLocationState {
  categoryName?: string;
}

export const CategoryScreen: React.FC = () => {
  const { isDarkMode, textColor, subTextColor } = useTheme();
  const { aartiIndex, isLoadingIndex, indexError, retryIndex, handleOpenAarti } = useReading();
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryName } = (location.state as CategoryLocationState | null) ?? {};
  const category = CATEGORIES.find(c => c.name === categoryName);

  const [vartaTab, setVartaTab] = useState<string>('84 Vaishnav');

  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);

  // Varta index fetching
  const { data: varta84, isLoading: loading84, error: error84, retry: retry84 } = useContentApi(
    () => getVarta84Index(),
    { enabled: category?.name === 'Varta' }
  );
  const { data: varta252, isLoading: loading252, error: error252, retry: retry252 } = useContentApi(
    () => getVarta252Index(),
    { enabled: category?.name === 'Varta' }
  );

  if (!category) return null;

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || category.name !== 'Varta') return;
    const distanceX = touchStart.x - touchEnd.x;
    if (distanceX > 50 && vartaTab === '84 Vaishnav') setVartaTab('252 Vaishnav');
    if (distanceX < -50 && vartaTab === '252 Vaishnav') setVartaTab('84 Vaishnav');
  };

  // ==========================================
  // Render helpers
  // ==========================================
  const renderAartiKirtan = () => {
    const filtered = aartiIndex.filter(t => t.category === category.name);
    if (isLoadingIndex) return <LoadingState message={`Loading ${category.name}...`} />;
    if (indexError) return <ErrorState message={indexError} onRetry={retryIndex} />;
    if (filtered.length === 0) return renderEmptyState();
    return (
      <div className="space-y-3">
        {filtered.map((item) => <BhajanCard key={item.id} item={item} onClick={handleOpenAarti} />)}
      </div>
    );
  };

  const renderVarta = () => {
    const vaishnavs = vartaTab === '84 Vaishnav' ? varta84 : varta252;
    const isLoading = vartaTab === '84 Vaishnav' ? loading84 : loading252;
    const error = vartaTab === '84 Vaishnav' ? error84 : error252;
    const retry = vartaTab === '84 Vaishnav' ? retry84 : retry252;

    if (isLoading) return <LoadingState message={`Loading ${vartaTab}...`} />;
    if (error) return <ErrorState message={error} onRetry={retry} />;
    if (!vaishnavs || vaishnavs.length === 0) return renderEmptyState();

    return (
      <div className="space-y-4">
        {vaishnavs.map((v) => (
          <VaishnavCard key={v.id} vaishnav={v} />
        ))}
      </div>
    );
  };

  const renderPad = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center mt-4">
        <BookOpen size={40} className={`mb-4 ${subTextColor} opacity-50`} />
        <p className={`font-medium ${textColor}`}>Coming Soon</p>
        <p className={`text-xs mt-2 ${subTextColor}`}>Pad content is being prepared</p>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center mt-4">
      <BookOpen size={40} className={`mb-4 ${subTextColor} opacity-50`} />
      <p className={`font-medium ${textColor}`}>No {category.name.toLowerCase()} found</p>
    </div>
  );

  const renderContent = () => {
    switch (category.name) {
      case 'Aartis':
      case 'Kirtan':
        return renderAartiKirtan();
      case 'Varta':
        return renderVarta();
      case 'Pad':
        return renderPad();
      default:
        return renderEmptyState();
    }
  };

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
        {renderContent()}
      </main>
    </>
  );
};

// ==========================================
// Vaishnav Card Sub-component
// ==========================================
interface VaishnavCardProps {
  vaishnav: VaishnavIndexItem;
}

const VaishnavCard: React.FC<VaishnavCardProps> = ({ vaishnav }) => {
  const { isDarkMode, textColor, subTextColor } = useTheme();
  const navigate = useNavigate();
  const [loadingPrasang, setLoadingPrasang] = useState<string | null>(null);

  const handlePrasangClick = useCallback(async (prasang: { id: string; title: string; file: string }) => {
    setLoadingPrasang(prasang.id);
    try {
      const detail = await getVartaContent(prasang.file);
      navigate(ROUTES.READ, {
        state: {
          item: { id: prasang.id, title: prasang.title, artist: vaishnav.name, category: 'Varta', file: prasang.file } as ContentIndexItem,
          detail,
        },
      });
    } catch (err) {
      const errorMsg = extractContentError(err);
      navigate(ROUTES.READ, {
        state: {
          item: { id: prasang.id, title: prasang.title, artist: vaishnav.name, category: 'Varta', file: prasang.file } as ContentIndexItem,
          contentError: errorMsg,
        },
      });
    } finally {
      setLoadingPrasang(null);
    }
  }, [navigate, vaishnav.name]);

  return (
    <GlassCard className="p-4 rounded-2xl">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-black/5'}`}>
          <span className={`text-lg font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{vaishnav.index}</span>
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${textColor}`}>{vaishnav.name}</h4>
          {vaishnav.bio && <p className={`text-xs mt-0.5 ${subTextColor}`}>{vaishnav.bio}</p>}
        </div>
      </div>
      <div className="space-y-2 ml-13">
        {vaishnav.prasangs.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePrasangClick(p)}
            disabled={loadingPrasang === p.id}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border
              ${isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80' 
                : 'bg-white/40 border-black/5 hover:bg-white/70 text-gray-700'}
              ${loadingPrasang === p.id ? 'opacity-60' : 'cursor-pointer hover:scale-[1.01]'}
            `}
          >
            {loadingPrasang === p.id ? 'Loading...' : p.title}
          </button>
        ))}
      </div>
    </GlassCard>
  );
};
