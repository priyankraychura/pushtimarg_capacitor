import React from 'react';
import { User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useReading } from '../hooks/useReading';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { GlassCard } from '../components/GlassCard';
import { BhajanCard } from '../components/BhajanCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { CATEGORIES } from '../constants/categories';
import { ROUTES } from '../constants/routes';

export const HomeScreen: React.FC = () => {
  const { isDarkMode, textColor, subTextColor } = useTheme();
  const { user, profileImage } = useAuth();
  const { aartiIndex, recentReadings, isLoadingIndex, indexError, retryIndex, handleOpenAarti } = useReading();
  const navigate = useNavigate();

  // Show the last 4 reading items, or fallback to featured if empty
  const displayItems = recentReadings.length > 0 ? recentReadings : aartiIndex.slice(0, 4);
  const displayTitle = recentReadings.length > 0 ? "Continue Reading" : "Featured";

  return (
    <>
      <ScreenHeader 
        title="Jai Shri Krishna" 
        subtitle="Discover Pushtimarg Nitya Niyam"
        rightElement={
          <IconButton 
            icon={profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full rounded-2xl object-cover" /> : <User size={20} />} 
            onClick={() => navigate(user ? ROUTES.PROFILE : ROUTES.LOGIN)} 
            className={profileImage ? "!p-0 overflow-hidden" : ""}
          />
        }
        className="!border-none !bg-transparent !shadow-none"
      />

      <main className="flex-1 overflow-y-auto px-6 pb-36 hide-scrollbar z-20 relative" style={{ maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)' }}>
        <section className="mb-8 mt-2">
          <GlassCard 
            onClick={() => navigate(ROUTES.CALENDAR)} 
            className="p-5 rounded-[24px] relative overflow-hidden flex items-center justify-between shadow-sm cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          >
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none ${isDarkMode ? 'bg-amber-500' : 'bg-orange-400'}`}></div>
            <div className="relative z-10">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-amber-500' : 'text-orange-600'}`}>Today's Tithi</span>
              <h3 className={`text-lg font-bold mt-1 ${textColor}`}>Vaishakh Sud 11 (Ekadashi)</h3>
              <p className={`text-xs mt-1 ${subTextColor}`}>Vikram Samvat 2082</p>
            </div>
            <div className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-2xl border backdrop-blur-md shadow-sm ${isDarkMode ? 'bg-white/10 border-white/20 text-amber-300' : 'bg-white/60 border-white/60 text-orange-500'}`}>
              <Calendar size={24} />
            </div>
          </GlassCard>
        </section>

        <section className="mb-8">
          <h2 className={`text-lg font-semibold mb-4 ${textColor}`}>Categories</h2>
          <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <GlassCard onClick={() => navigate(ROUTES.CATEGORY, { state: { categoryName: cat.name } })} className="w-16 h-16 flex items-center justify-center rounded-[20px] cursor-pointer hover:scale-105 transition-transform">
                  {cat.icon}
                </GlassCard>
                <span className={`text-[11px] font-medium text-center ${textColor}`}>{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-4 ${textColor}`}>{displayTitle}</h2>
          {isLoadingIndex ? <LoadingState message="Loading items..." /> : indexError ? <ErrorState message={indexError} onRetry={retryIndex} /> : (
            <div className="space-y-3">
              {displayItems.map((item) => <BhajanCard key={item.id} item={item} onClick={handleOpenAarti} />)}
            </div>
          )}
        </section>
      </main>
    </>
  );
};
