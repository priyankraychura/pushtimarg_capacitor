import React from 'react';
import { Home, Search, Library, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { GlassCard } from './GlassCard';
import { ROUTES } from '../constants/routes';
import type { RoutePath } from '../constants/routes';

export const BottomNav: React.FC = () => {
  const { subTextColor, primaryText } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide bottom nav on specific routes
  const hiddenRoutes: RoutePath[] = [ROUTES.READ, ROUTES.CATEGORY, ROUTES.LOGIN, ROUTES.CALENDAR, ROUTES.PROFILE];
  if (hiddenRoutes.includes(location.pathname as RoutePath)) return null;

  const tabs = [
    { id: ROUTES.HOME, icon: Home, label: 'Home' },
    { id: ROUTES.SEARCH, icon: Search, label: 'Search' },
    { id: ROUTES.LIBRARY, icon: Library, label: 'Library' },
    { id: ROUTES.SETTINGS, icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full z-30 flex flex-col items-center pb-6 px-4 pointer-events-none">
      <GlassCard className="w-full flex justify-around items-center py-4 px-2 rounded-3xl mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.2)] pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.id;
          return (
            <button key={tab.id} onClick={() => navigate(tab.id)} className={`flex flex-col items-center space-y-1 w-16 transition-colors ${isActive ? primaryText : subTextColor}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && <span className="text-[10px] font-bold mt-1">{tab.label}</span>}
            </button>
          );
        })}
      </GlassCard>
    </div>
  );
};
