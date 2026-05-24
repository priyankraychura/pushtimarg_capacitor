import React, { useState } from 'react';
import { ArrowLeft, Mail, KeyRound, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { IconButton } from '../components/IconButton';
import { GlassCard } from '../components/GlassCard';
import { TextInput } from '../components/TextInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { ROUTES } from '../constants/routes';
import { extractApiError } from '../lib/axios';
import * as authService from '../services/authService';

// ==========================================
// Forgot Password Screen
// ==========================================
// Multi-step flow:
//   Step 1: Enter email → POST /auth/forgot-password
//   Step 2: Enter OTP  → POST /auth/verify-password-reset-otp
//   Step 3: New password → POST /auth/reset-password
//   Step 4: Success state

export const ForgotPasswordScreen: React.FC = () => {
  const { isDarkMode, textColor, subTextColor, primaryText } = useTheme();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleBack = () => {
    setErrorMsg('');
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await authService.forgotPassword(email.trim());
      setStep(2);
    } catch (err) {
      setErrorMsg(extractApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit code.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const result = await authService.verifyPasswordResetOtp({ email: email.trim(), otp });
      setResetToken(result.resetToken);
      setStep(3);
    } catch (err) {
      setErrorMsg(extractApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await authService.resetPassword({
        email: email.trim(),
        resetToken,
        password: newPassword,
      });
      setStep(4);
    } catch (err) {
      setErrorMsg(extractApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepIcons = [Mail, KeyRound, Lock, CheckCircle];
  const StepIcon = stepIcons[Math.min(step - 1, stepIcons.length - 1)];
  const stepTitles = ['Reset Password', 'Verify Code', 'New Password', 'Password Reset!'];
  const stepSubtitles = [
    'Enter your email to receive a verification code.',
    'Enter the 6-digit code sent to your email.',
    'Create a new secure password.',
    'Your password has been updated successfully.',
  ];

  return (
    <div className="flex-1 flex flex-col relative w-full h-full z-40 bg-transparent">
      <div className="shrink-0 z-40 px-4 pt-12 pb-2 relative">
        {step < 4 && <IconButton icon={<ArrowLeft size={20} />} onClick={handleBack} />}
      </div>

      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-32 hide-scrollbar relative flex flex-col items-center">
        {/* Icon */}
        <div
          className={`w-24 h-24 rounded-full shrink-0 flex items-center justify-center mb-8 shadow-lg ${
            isDarkMode
              ? 'bg-gradient-to-br from-blue-500 to-blue-700'
              : 'bg-gradient-to-br from-orange-400 to-rose-500'
          }`}
        >
          <StepIcon size={40} className="text-white" />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold tracking-tight mb-2 ${textColor}`}>
            {stepTitles[step - 1]}
          </h1>
          <p className={`text-sm ${subTextColor}`}>{stepSubtitles[step - 1]}</p>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <GlassCard className="w-full p-5 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}
            <TextInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PrimaryButton onClick={handleSendOtp} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Send Code'}
            </PrimaryButton>
          </GlassCard>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <GlassCard className="w-full p-5 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}
            <TextInput
              label="Verification Code"
              type="text"
              placeholder="• • • • • •"
              maxLength={6}
              className="text-xl font-bold tracking-[0.5em] text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            <PrimaryButton onClick={handleVerifyOtp} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Verify Code'}
            </PrimaryButton>
            <p className={`text-xs text-center ${subTextColor}`}>
              OTP expires in 10 minutes. Check your backend terminal if SMTP is not configured.
            </p>
          </GlassCard>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <GlassCard className="w-full p-5 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}
            <TextInput
              label="New Password"
              type="password"
              placeholder="Create a password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <PrimaryButton onClick={handleResetPassword} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Reset Password'}
            </PrimaryButton>
          </GlassCard>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <GlassCard className="w-full p-5 space-y-5">
            <p className={`text-sm text-center ${subTextColor}`}>
              You can now log in with your new password.
            </p>
            <PrimaryButton onClick={() => navigate(ROUTES.LOGIN)}>Go to Login</PrimaryButton>
          </GlassCard>
        )}

        {/* Back to login link */}
        {step < 4 && (
          <p className={`mt-8 text-sm font-medium ${subTextColor}`}>
            Remember your password?{' '}
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className={`font-bold transition-colors ${primaryText}`}
            >
              Sign In
            </button>
          </p>
        )}
      </main>
    </div>
  );
};
