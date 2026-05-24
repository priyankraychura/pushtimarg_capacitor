import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");

  const { isDarkMode } = context;
  return {
    ...context,
    themeBg: isDarkMode ? "from-slate-900 via-stone-900 to-neutral-950" : "from-orange-50 via-rose-50 to-amber-100",
    textColor: isDarkMode ? "text-amber-50" : "text-slate-900",
    subTextColor: isDarkMode ? "text-amber-200/60" : "text-slate-600",
    borderGlass: isDarkMode ? "border-white/10" : "border-black/5",
    bgGlass: isDarkMode ? "bg-black/30" : "bg-white/40",
    bgGlassHover: isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5",
    primaryGradient: isDarkMode ? "bg-gradient-to-r from-amber-500 to-orange-600" : "bg-gradient-to-r from-orange-500 to-rose-500",
    primaryText: isDarkMode ? "text-amber-400" : "text-orange-600",
  };
};
