import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { IconButton } from '../components/IconButton';
import { ROUTES } from '../constants/routes';

export const CalendarScreen: React.FC = () => {
  const { isDarkMode, textColor, subTextColor, borderGlass, bgGlassHover, primaryGradient, primaryText } = useTheme();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<number>(24);
  const today = 24;

  const tithiData: Record<number, { tithi: string, event: string, type: 'utsav' | 'agiyaras' | 'normal' }> = {
    11: { tithi: "Vaishakh Sud 11", event: "Mohini Ekadashi", type: 'agiyaras' },
    24: { tithi: "Vaishakh Sud 14", event: "Nrusinh Chaturdashi", type: 'utsav' },
    25: { tithi: "Vaishakh Sud 15", event: "Purnima (Snan Yatra)", type: 'utsav' },
    27: { tithi: "Jeth Vad 2", event: "", type: 'normal' },
  };

  const upcomingAgiyaras = [
    { date: "May 27", tithi: "Jeth Vad 11", event: "Apara Ekadashi" },
    { date: "Jun 11", tithi: "Jeth Sud 11", event: "Nirjala Ekadashi" },
    { date: "Jun 26", tithi: "Ashadh Vad 11", event: "Yogini Ekadashi" },
  ];

  const selectedData = tithiData[selectedDate];

  return (
    <>
      <ScreenHeader title="Pushtimarg Calendar" showBack onBack={() => navigate(ROUTES.HOME)} />
      
      <main className="flex-1 overflow-y-auto px-6 pt-4 pb-32 hide-scrollbar z-20 relative">
        <GlassCard className="p-6 mb-8 relative overflow-hidden flex flex-col shadow-lg border-t-white/40">
            <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[40px] opacity-30 pointer-events-none ${isDarkMode ? 'bg-amber-500' : 'bg-orange-500'}`}></div>
            <div className={`absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-[40px] opacity-20 pointer-events-none ${isDarkMode ? 'bg-rose-500' : 'bg-rose-400'}`}></div>

            <div className="relative z-10 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <span className={`text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-orange-100 text-orange-600'}`}>
                        {selectedDate === today ? "Today" : "Selected Date"}
                    </span>
                    <span className={`text-sm font-bold ${subTextColor}`}>Vaishakh 2082</span>
                </div>

                <h2 className={`text-4xl font-black tracking-tight ${textColor}`}>May {selectedDate}</h2>
                
                <div className="mt-2 flex items-center gap-2">
                  <p className={`text-lg font-bold ${primaryText}`}>
                      {selectedData ? selectedData.tithi : "Normal Tithi"}
                  </p>
                </div>

                {selectedData?.event && (
                    <div className="mt-4 inline-flex">
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm ${primaryGradient} text-white`}>
                          ✨ {selectedData.event}
                      </span>
                    </div>
                )}
            </div>
        </GlassCard>

        <GlassCard className="p-5 mb-8">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className={`text-lg font-extrabold ${textColor}`}>May 2026</h3>
            <div className="flex gap-2">
              <IconButton icon={<ChevronLeft size={16} />} className="!w-8 !h-8 !p-0" />
              <IconButton icon={<ChevronRight size={16} />} className="!w-8 !h-8 !p-0" />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-6 gap-x-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${subTextColor}`}>{d}</div>
            ))}
            {Array.from({ length: 5 }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDate;
              const isToday = day === today;
              const hasEvent = tithiData[day];

              return (
                <div key={day} className="flex items-center justify-center">
                  <button 
                    onClick={() => setSelectedDate(day)}
                    className={`relative w-10 h-10 flex flex-col items-center justify-center rounded-[14px] transition-all duration-200
                      ${isSelected ? (isDarkMode ? 'bg-amber-500 text-white shadow-md scale-105 z-10' : 'bg-[#F47820] text-white shadow-md scale-105 z-10') : bgGlassHover}
                      ${!isSelected && isToday ? `ring-2 ring-inset ${isDarkMode ? 'ring-amber-500/50' : 'ring-[#F47820]/40'}` : ''}
                    `}
                  >
                    <span className={`text-[15px] ${isSelected ? 'font-bold' : `font-medium ${textColor}`}`}>
                      {day}
                    </span>
                    {hasEvent && (
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

        <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ml-2 ${subTextColor}`}>Upcoming Agiyaras</h3>
        <div className="space-y-3">
          {upcomingAgiyaras.map((item, idx) => (
            <GlassCard key={idx} className="p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shadow-sm flex-shrink-0 border ${borderGlass} ${isDarkMode ? 'bg-white/5' : 'bg-white/60'}`}>
                <span className={`text-[10px] font-bold uppercase ${subTextColor}`}>{item.date.split(' ')[0]}</span>
                <span className={`text-sm font-bold ${primaryText}`}>{item.date.split(' ')[1]}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className={`font-semibold text-sm ${textColor}`}>{item.event}</h4>
                <p className={`text-xs mt-0.5 ${subTextColor}`}>{item.tithi}</p>
              </div>
              <ChevronRight size={20} className={subTextColor} />
            </GlassCard>
          ))}
        </div>
      </main>
    </>
  );
};
