import React, { useState } from 'react';
import { ArrowLeft, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { IconButton } from '../components/IconButton';
import { GlassCard } from '../components/GlassCard';
import { TextInput } from '../components/TextInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { ROUTES } from '../constants/routes';
import { extractApiError } from '../lib/axios';

export const LoginScreen: React.FC = () => {
  const { isDarkMode, textColor, subTextColor, primaryText } = useTheme();
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleBack = () => {
    navigate(ROUTES.HOME);
  };

  const handleAuth = async () => {
    setErrorMsg('');

    // Client-side validation
    if (isSignUp && (!name.trim() || name.trim().length < 2)) {
      setErrorMsg('Name must be at least 2 characters.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter your email.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      // On success, navigate to home
      navigate(ROUTES.HOME);
    } catch (err) {
      setErrorMsg(extractApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMsg('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full z-40 bg-transparent">
      <div className="shrink-0 z-40 px-4 pt-12 pb-2 relative">
        <IconButton icon={<ArrowLeft size={20} />} onClick={handleBack} />
      </div>

      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-32 hide-scrollbar relative flex flex-col items-center">
        <div
          className={`w-24 h-24 rounded-full shrink-0 flex items-center justify-center mb-8 shadow-lg ${
            isDarkMode
              ? 'bg-gradient-to-br from-amber-500 to-orange-700'
              : 'bg-gradient-to-br from-orange-400 to-rose-500'
          }`}
        >
          <User size={40} className="text-white" />
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold tracking-tight mb-2 ${textColor}`}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className={`text-sm ${subTextColor}`}>
            {isSignUp
              ? 'Join to sync your library and history.'
              : 'Sign in to sync your library and history.'}
          </p>
        </div>

        <GlassCard className="w-full p-5 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {isSignUp && (
            <TextInput
              label="Name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <TextInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <TextInput
              label="Password"
              type="password"
              placeholder={isSignUp ? 'Create a password (min 6 chars)' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isSignUp && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                  className={`text-xs font-semibold transition-colors ${primaryText}`}
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          <PrimaryButton onClick={handleAuth} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : isSignUp ? (
              'Sign Up'
            ) : (
              'Sign In'
            )}
          </PrimaryButton>
        </GlassCard>

        <p className={`mt-8 text-sm font-medium ${subTextColor}`}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={toggleMode}
            className={`font-bold transition-colors ${primaryText}`}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </main>
    </div>
  );
};
