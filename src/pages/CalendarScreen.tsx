import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { IconButton } from '../components/IconButton';
import { ROUTES } from '../constants/routes';
import { generateCalendarGrid, getUpcomingAgiyaras, WEEKDAYS, type DayData } from '../lib/calendarLogic';

const ENGLISH_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const CalendarScreen: React.FC = () => {
  const { isDarkMode, textColor, subTextColor, borderGlass, bgGlassHover, primaryGradient, primaryText } = useTheme();
  const navigate = useNavigate();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  // Generate calendar grid (memoized for performance)
  const calendarDays = useMemo(() => {
    return generateCalendarGrid(new Date(currentYear, currentMonth, 1));
  }, [currentMonth, currentYear]);

  // Get upcoming agiyaras (memoized)
  const upcomingAgiyaras = useMemo(() => getUpcomingAgiyaras(), []);

  // Find today's entry to auto-select
  const todayEntry = useMemo(() => {
    return calendarDays.find(d => d.isToday) || null;
  }, [calendarDays]);

  // The currently selected day data (default to today if in current month view)
  const activeDay = selectedDay || todayEntry;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedDay(null);
  };

  const formatAgiyarasDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return { month: months[date.getMonth()], day: date.getDate().toString() };
  };

  return (
    <>
      <ScreenHeader title="Pushtimarg Calendar" showBack onBack={() => navigate(ROUTES.HOME)} />
      
      <main className="flex-1 overflow-y-auto px-6 pt-4 pb-32 hide-scrollbar z-20 relative">
        {/* Selected Day Info Card */}
        <GlassCard className="p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-orange-100/80 text-orange-600'}`}>
                    {activeDay?.isToday ? "Today" : "Selected Date"}
                </span>
                <span className={`text-xs font-semibold ${subTextColor}`}>
                  {activeDay ? `${activeDay.tithi.gujMonth} ${activeDay.tithi.vikramSamvat}` : ''}
                </span>
            </div>

            <h2 className={`text-2xl font-extrabold ${textColor}`}>
              {activeDay ? `${ENGLISH_MONTHS[activeDay.date.getMonth()]} ${activeDay.date.getDate()}` : ''}
            </h2>
            
            <p className={`text-sm font-semibold mt-1 ${primaryText}`}>
              {activeDay ? `${activeDay.tithi.gujMonth} ${activeDay.tithi.paksha} ${activeDay.tithi.tithiName}` : 'Select a date'}
            </p>

            {activeDay && (activeDay.tithi.isAgiyaras || activeDay.tithi.isPoonam || activeDay.tithi.isAmas) && (
                <div className="mt-3 inline-flex">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${primaryGradient} text-white`}>
                      ✨ {activeDay.tithi.isAgiyaras ? `${activeDay.tithi.gujMonth} ${activeDay.tithi.paksha} Ekadashi` : activeDay.tithi.isPoonam ? `${activeDay.tithi.gujMonth} Poonam` : `${activeDay.tithi.gujMonth} Amas`}
                  </span>
                </div>
            )}
        </GlassCard>

        {/* Calendar Grid */}
        <GlassCard className="p-5 mb-8">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className={`text-lg font-extrabold ${textColor}`}>{ENGLISH_MONTHS[currentMonth]} {currentYear}</h3>
            <div className="flex gap-2">
              <IconButton icon={<ChevronLeft size={16} />} className="!w-8 !h-8 !p-0" onClick={handlePrevMonth} />
              <IconButton icon={<ChevronRight size={16} />} className="!w-8 !h-8 !p-0" onClick={handleNextMonth} />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-6 gap-x-1 text-center">
            {WEEKDAYS.map((d, i) => (
              <div key={i} className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${subTextColor}`}>{d.charAt(0)}</div>
            ))}
            {calendarDays.map((dayData, idx) => {
              const isSelected = selectedDay?.date.getTime() === dayData.date.getTime();
              const isToday = dayData.isToday;
              const hasSpecialEvent = dayData.tithi.isAgiyaras || dayData.tithi.isPoonam || dayData.tithi.isAmas;

              return (
                <div key={idx} className="flex items-center justify-center">
                  <button 
                    onClick={() => setSelectedDay(dayData)}
                    className={`relative w-10 h-10 flex flex-col items-center justify-center rounded-[14px] transition-all duration-200
                      ${isSelected ? (isDarkMode ? 'bg-amber-500 text-white shadow-md scale-105 z-10' : 'bg-[#F47820] text-white shadow-md scale-105 z-10') : bgGlassHover}
                      ${!isSelected && isToday ? `ring-2 ring-inset ${isDarkMode ? 'ring-amber-500/50' : 'ring-[#F47820]/40'}` : ''}
                      ${!dayData.isCurrentMonth ? 'opacity-30' : ''}
                    `}
                  >
                    <span className={`text-[15px] ${isSelected ? 'font-bold' : `font-medium ${textColor}`}`}>
                      {dayData.date.getDate()}
                    </span>
                    {hasSpecialEvent && dayData.isCurrentMonth && (
                      <div className={`absolute bottom-1.5 w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white' : (isDarkMode ? 'bg-amber-500' : 'bg-[#F47820]')
                      }`} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Upcoming Agiyaras */}
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ml-2 ${subTextColor}`}>Upcoming Agiyaras</h3>
        <div className="space-y-3">
          {upcomingAgiyaras.map((item, idx) => {
            const { month, day } = formatAgiyarasDate(item.date);
            return (
              <GlassCard key={idx} className="p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shadow-sm flex-shrink-0 border ${borderGlass} ${isDarkMode ? 'bg-white/5' : 'bg-white/60'}`}>
                  <span className={`text-[10px] font-bold uppercase ${subTextColor}`}>{month}</span>
                  <span className={`text-sm font-bold ${primaryText}`}>{day}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className={`font-semibold text-sm ${textColor}`}>{item.tithi.gujMonth} {item.tithi.paksha} Ekadashi</h4>
                  <p className={`text-xs mt-0.5 ${subTextColor}`}>{item.tithi.gujMonth} {item.tithi.paksha} {item.tithi.tithiName}</p>
                </div>
                <ChevronRight size={20} className={subTextColor} />
              </GlassCard>
            );
          })}
        </div>
      </main>
    </>
  );
};
