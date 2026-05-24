import React, { useState } from 'react';
import { Moon, Type, Bell, PlayCircle, Share2, MessageSquare, HelpCircle, Shield, SunMedium, Plus, Minus } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsRow } from '../components/SettingsRow';
import { ToggleSwitch } from '../components/ToggleSwitch';

export const SettingsScreen: React.FC = () => {
  const { isDarkMode, setIsDarkMode, fontSize, setFontSize, textColor, subTextColor } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [floatingPlayerEnabled, setFloatingPlayerEnabled] = useState<boolean>(false);

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({ title: 'Pushtimarg', text: 'Discover divine texts of Pushtimarg', url: window.location.origin });
    }
  };

  const handleSendFeedback = () => {
    window.open('mailto:feedback@pushtimarg.app?subject=App%20Feedback', '_blank');
  };

  return (
    <>
      <ScreenHeader title="Settings" className="!border-none !bg-transparent !shadow-none" />
      <main className="flex-1 overflow-y-auto px-6 pb-36 hide-scrollbar z-20 relative" style={{ maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 120px), transparent 100%)' }}>
        
        <SettingsSection title="Appearance" className="mt-4">
          <SettingsRow 
            icon={<Moon size={20} />} title="Dark Mode" 
            rightElement={<ToggleSwitch enabled={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />} 
          />
          <SettingsRow 
            icon={<Type size={20} />} title="Text Size" borderBottom={false}
            rightElement={
              <div className="flex items-center gap-3">
                <IconButton icon={<Minus size={14} />} onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="!p-1.5 w-8 h-8" />
                <span className={`font-bold text-sm w-6 text-center ${textColor}`}>{fontSize}</span>
                <IconButton icon={<Plus size={14} />} onClick={() => setFontSize(Math.min(36, fontSize + 2))} className="!p-1.5 w-8 h-8" />
              </div>
            }
          />
        </SettingsSection>

        <SettingsSection title="General">
          <SettingsRow 
            icon={<Bell size={20} />} title="Notifications" 
            rightElement={<ToggleSwitch enabled={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />} 
          />
          <SettingsRow 
            icon={<PlayCircle size={20} />} title="Floating Player" borderBottom={false}
            rightElement={<ToggleSwitch enabled={floatingPlayerEnabled} onChange={() => setFloatingPlayerEnabled(!floatingPlayerEnabled)} />} 
          />
        </SettingsSection>

        <SettingsSection title="Community & Support">
          <SettingsRow icon={<Share2 size={20} />} title="Share App" onClick={handleShareApp} />
          <SettingsRow icon={<MessageSquare size={20} />} title="Send Feedback" onClick={handleSendFeedback} />
          <SettingsRow icon={<HelpCircle size={20} />} title="FAQ & Help" />
          <SettingsRow icon={<Shield size={20} />} title="Privacy Policy" borderBottom={false} />
        </SettingsSection>

        <div className="mt-12 mb-8 flex flex-col items-center justify-center text-center">
          <div className={`w-20 h-20 rounded-full shrink-0 flex items-center justify-center mb-4 shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-amber-500 to-orange-700' : 'bg-gradient-to-br from-orange-400 to-rose-500'}`}><SunMedium size={40} className="text-white" /></div>
          <h2 className={`text-xl font-bold tracking-tight ${textColor}`}>Pushtimarg</h2>
          <p className={`text-sm mt-1 font-medium ${subTextColor}`}>Version 1.0.0</p>
        </div>
      </main>
    </>
  );
};
