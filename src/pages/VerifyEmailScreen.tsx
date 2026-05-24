import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ROUTES } from '../constants/routes';
import { extractApiError } from '../lib/axios';
import * as authService from '../services/authService';

// ==========================================
// Verify Email Screen
// ==========================================
// Reads ?token=... from the URL, calls the backend, shows result.

type VerifyState = 'loading' | 'success' | 'error';

export const VerifyEmailScreen: React.FC = () => {
  const { isDarkMode, textColor, subTextColor } = useTheme();
  const { isAuthenticated, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [state, setState] = useState<VerifyState>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setState('error');
      setErrorMsg('No verification token provided. Please use the link from your email.');
      return;
    }

    let cancelled = false;

    authService
      .verifyEmail(token)
      .then(() => {
        if (!cancelled) {
          setState('success');
          // If the user is logged in, refresh their profile to update isEmailVerified
          if (isAuthenticated) {
            refreshUser();
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState('error');
          setErrorMsg(extractApiError(err));
        }
      });

    return () => {
      cancelled = true;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const iconSize = 48;

  return (
    <div className="flex-1 flex flex-col relative w-full h-full z-40 bg-transparent">
      <main className="flex-1 overflow-y-auto px-6 pt-20 pb-32 hide-scrollbar relative flex flex-col items-center justify-center">
        {/* Loading */}
        {state === 'loading' && (
          <div className="flex flex-col items-center gap-6">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${
                isDarkMode
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                  : 'bg-gradient-to-br from-orange-400 to-rose-500'
              }`}
            >
              <Loader2 size={iconSize} className="text-white animate-spin" />
            </div>
            <div className="text-center">
              <h1 className={`text-2xl font-bold tracking-tight mb-2 ${textColor}`}>
                Verifying Email...
              </h1>
              <p className={`text-sm ${subTextColor}`}>Please wait while we verify your email address.</p>
            </div>
          </div>
        )}

        {/* Success */}
        {state === 'success' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-400 to-green-600">
              <CheckCircle size={iconSize} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className={`text-2xl font-bold tracking-tight mb-2 ${textColor}`}>
                Email Verified!
              </h1>
              <p className={`text-sm ${subTextColor}`}>
                Your email has been verified successfully. You can now enjoy all features.
              </p>
            </div>
            <GlassCard className="w-full p-5 mt-4">
              <PrimaryButton onClick={() => navigate(isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN)}>
                {isAuthenticated ? 'Go to Home' : 'Go to Login'}
              </PrimaryButton>
            </GlassCard>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-red-400 to-rose-600">
              <XCircle size={iconSize} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className={`text-2xl font-bold tracking-tight mb-2 ${textColor}`}>
                Verification Failed
              </h1>
              <p className={`text-sm ${subTextColor}`}>{errorMsg}</p>
            </div>
            <GlassCard className="w-full p-5 mt-4">
              <PrimaryButton onClick={() => navigate(isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN)}>
                {isAuthenticated ? 'Go to Home' : 'Go to Login'}
              </PrimaryButton>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
};
