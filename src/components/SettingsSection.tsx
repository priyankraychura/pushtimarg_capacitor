import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { GlassCard } from './GlassCard';
import type { SettingsSectionProps } from '../types';

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children, className = "" }) => {
  const { subTextColor } = useTheme();
  return (
    <div className={className}>
      <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ml-2 ${subTextColor}`}>{title}</h3>
      <GlassCard className="overflow-hidden mb-8">
        {children}
      </GlassCard>
    </div>
  );
};
