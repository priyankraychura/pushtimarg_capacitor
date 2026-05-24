import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useReading } from '../hooks/useReading';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextInput } from '../components/TextInput';
import { BhajanCard } from '../components/BhajanCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { PUSHTIMARG_TEXTS } from '../constants/data';

export const SearchScreen: React.FC = () => {
  const { textColor } = useTheme();
  const { isLoadingList, listError, handleRetryList, handleOpenText } = useReading();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const displayTexts = searchQuery 
    ? PUSHTIMARG_TEXTS.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.author.toLowerCase().includes(searchQuery.toLowerCase()))
    : PUSHTIMARG_TEXTS.filter(t => t.category === "Varta");

  return (
    <>
      <ScreenHeader 
        title={
          <TextInput 
            icon={<Search size={20} />} 
            placeholder="Search aartis, kirtans, authors..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        }
        className="!border-none !bg-transparent !shadow-none !pt-8" 
      />

      <main className="flex-1 overflow-y-auto px-6 pb-36 hide-scrollbar z-20 relative" style={{ maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)' }}>
        <h2 className={`text-lg font-semibold mb-4 mt-2 ${textColor}`}>{searchQuery ? 'Results' : 'Featured Varta'}</h2>
        
        {isLoadingList ? <LoadingState message="Searching the library..." /> : listError ? <ErrorState message={listError} onRetry={handleRetryList} /> : (
          <div className="space-y-3">
            {displayTexts.length > 0 ? (
              displayTexts.map((item) => <BhajanCard key={item.id} item={item} onClick={handleOpenText} />)
            ) : (
              <ErrorState message="Try searching for something else" /> 
            )}
          </div>
        )}
      </main>
    </>
  );
};
