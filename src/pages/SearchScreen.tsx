import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useReading } from '../hooks/useReading';
import { useContentApi } from '../hooks/useContentApi';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextInput } from '../components/TextInput';
import { BhajanCard } from '../components/BhajanCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { getVarta84Index, getVarta252Index } from '../services/contentService';
import type { ContentIndexItem, VaishnavIndexItem } from '../types';

export const SearchScreen: React.FC = () => {
  const { textColor } = useTheme();
  const { aartiIndex, isLoadingIndex, indexError, retryIndex, handleOpenAarti } = useReading();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Also fetch varta indexes for searching across all content
  const { data: varta84 } = useContentApi(() => getVarta84Index());
  const { data: varta252 } = useContentApi(() => getVarta252Index());

  // Convert varta vaishnavs to ContentIndexItem shape for unified search
  const allItems = useMemo<ContentIndexItem[]>(() => {
    const items: ContentIndexItem[] = [...aartiIndex];

    const mapVaishnavs = (vaishnavs: VaishnavIndexItem[] | null) => {
      if (!vaishnavs) return;
      for (const v of vaishnavs) {
        for (const p of v.prasangs) {
          items.push({
            id: p.id,
            title: `${v.name} — ${p.title}`,
            artist: v.name,
            category: 'Varta',
            file: p.file,
          });
        }
      }
    };

    mapVaishnavs(varta84);
    mapVaishnavs(varta252);

    return items;
  }, [aartiIndex, varta84, varta252]);

  const displayTexts = useMemo(() => {
    if (!searchQuery) {
      // Show featured aartis when not searching
      return aartiIndex.slice(0, 6);
    }
    const q = searchQuery.toLowerCase();
    return allItems.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [searchQuery, allItems, aartiIndex]);

  return (
    <>
      <ScreenHeader 
        title={
          <TextInput 
            icon={<Search size={20} />} 
            placeholder="Search aartis, kirtans, varta..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        }
        className="!border-none !bg-transparent !shadow-none !pt-8" 
      />

      <main className="flex-1 overflow-y-auto px-6 pb-36 hide-scrollbar z-20 relative" style={{ maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)' }}>
        <h2 className={`text-lg font-semibold mb-4 mt-2 ${textColor}`}>{searchQuery ? 'Results' : 'Featured'}</h2>
        
        {isLoadingIndex ? <LoadingState message="Loading content..." /> : indexError ? <ErrorState message={indexError} onRetry={retryIndex} /> : (
          <div className="space-y-3">
            {displayTexts.length > 0 ? (
              displayTexts.map((item) => <BhajanCard key={item.id} item={item} onClick={handleOpenAarti} />)
            ) : (
              <ErrorState message="No results found. Try a different search." /> 
            )}
          </div>
        )}
      </main>
    </>
  );
};
