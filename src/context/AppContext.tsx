import { Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { GLOBAL_STYLES } from '../theme/styles';

// Providers
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { FavoritesProvider } from './FavoritesContext';
import { ReadingProvider } from './ReadingContext';

// Navigation component
import { BottomNav } from '../components/BottomNav';

// ==========================================
// Inner Layout (needs ThemeContext to be available)
// ==========================================
function AppLayout() {
  const { isDarkMode } = useTheme();
  const themeBg = isDarkMode ? "from-[#0d1117] via-[#111827] to-[#0f172a]" : "from-orange-50 via-rose-50 to-amber-100";

  return (
    <div className={`w-full min-h-screen bg-gradient-to-br ${themeBg} transition-colors duration-500 font-sans flex justify-center overflow-hidden relative`}>
      {/* Background blobs */}
      <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob ${isDarkMode ? 'bg-slate-700/30' : 'bg-orange-300'}`}></div>
      <div className={`absolute top-[20%] right-[-10%] w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000 ${isDarkMode ? 'bg-blue-950/50' : 'bg-rose-300'}`}></div>
      <div className={`absolute bottom-[-20%] left-[20%] w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000 ${isDarkMode ? 'bg-indigo-950/40' : 'bg-amber-300'}`}></div>

      <div className="w-full max-w-md h-[100dvh] flex flex-col relative z-10">
        <div className="flex-1 flex flex-col relative w-full h-full">
          <Outlet />
        </div>
        <BottomNav />
      </div>

      <style dangerouslySetInnerHTML={{__html: GLOBAL_STYLES}} />
    </div>
  );
}

// ==========================================
// Root Provider Composition
// ==========================================
export default function PushtimargApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <ReadingProvider>
            <AppLayout />
          </ReadingProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
