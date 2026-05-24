import React, { useState, useEffect, useRef } from 'react';
import { User, Camera, Mail, Lock, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { TextInput } from '../components/TextInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { ROUTES } from '../constants/routes';

export const ProfileScreen: React.FC = () => {
  const { isDarkMode, textColor, subTextColor } = useTheme();
  const { user, logout, profileImage, updateProfileImage } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editName, setEditName] = useState<string>(user?.name || '');
  const [editEmail, setEditEmail] = useState<string>(user?.email || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Profile update is client-side only for now (no backend endpoint)
    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  };

  const handleCancel = () => {
    setEditName(user.name);
    setEditEmail(user.email);
  };

  return (
    <>
      <ScreenHeader title="Profile" showBack onBack={() => navigate(ROUTES.HOME)} />
      <main className="flex-1 overflow-y-auto px-6 pt-4 pb-32 hide-scrollbar z-20 relative">
        <div className="flex flex-col items-center mt-6 mb-8">
          <div
            className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-lg border-4 ${
              isDarkMode ? 'border-slate-800' : 'border-white'
            } ${!profileImage ? 'bg-gradient-to-br from-orange-400 to-rose-500' : ''}`}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={48} className="text-white" />
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md transition-transform active:scale-95 ${
                isDarkMode ? 'bg-amber-500' : 'bg-orange-500'
              }`}
            >
              <Camera size={14} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>
          <h2 className={`mt-4 text-2xl font-bold tracking-tight ${textColor}`}>{user.name}</h2>
          <p className={`text-sm font-medium mt-1 ${subTextColor}`}>{user.email}</p>
        </div>

        {/* Email verification banner */}
        {!user.isEmailVerified && (
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl mb-6 border ${
              isDarkMode
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
          >
            <AlertTriangle size={20} className="shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold">Email not verified</p>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-amber-400/70' : 'text-amber-600'}`}>
                Check your inbox for a verification link.
              </p>
            </div>
          </div>
        )}

        <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ml-2 ${subTextColor}`}>Profile Details</h3>
        <GlassCard className="p-5 mb-6 space-y-4">
          <TextInput
            label="Name"
            icon={<User size={18} />}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextInput
            label="Email"
            type="email"
            icon={<Mail size={18} />}
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCancel}
              className={`flex-1 py-3.5 rounded-2xl font-bold transition-all ${
                isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-slate-800 hover:bg-black/10'
              }`}
            >
              Cancel
            </button>
            <PrimaryButton className="flex-1 !mt-0" onClick={handleSave}>
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : 'Save'}
            </PrimaryButton>
          </div>
        </GlassCard>

        <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ml-2 ${subTextColor}`}>Security</h3>
        <GlassCard className="p-5 mb-8">
          <button
            className={`w-full py-4 flex items-center justify-center gap-2 rounded-2xl font-bold transition-all border-2 ${
              isDarkMode
                ? 'border-white/10 text-white hover:bg-white/5'
                : 'border-black/5 text-slate-800 hover:bg-black/5'
            }`}
          >
            <Lock size={18} />
            Change Password
          </button>
        </GlassCard>

        <PrimaryButton onClick={logout} className="!bg-gradient-to-r !from-red-500 !to-rose-600 !mt-4">
          Log Out
        </PrimaryButton>
      </main>
    </>
  );
};
