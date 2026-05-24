import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");

  const { isDarkMode } = context;
  return {
    ...context,
    themeBg: isDarkMode ? "from-[#0d1117] via-[#111827] to-[#0f172a]" : "from-orange-50 via-rose-50 to-amber-100",
    textColor: isDarkMode ? "text-slate-100" : "text-slate-900",
    subTextColor: isDarkMode ? "text-slate-400" : "text-slate-600",
    borderGlass: isDarkMode ? "border-slate-700/40" : "border-black/5",
    bgGlass: isDarkMode ? "bg-slate-800/50" : "bg-white/40",
    bgGlassHover: isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-black/5",
    primaryGradient: isDarkMode ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gradient-to-r from-orange-500 to-rose-500",
    primaryText: isDarkMode ? "text-blue-400" : "text-orange-600",
  };
};
