import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OtpInput from '../components/OtpInput';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RefreshCw,
  BookOpen
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const { requestForgotPassword, submitResetPassword, resendOtp } = useAuth();
  const navigate = useNavigate();

  // 'email' | 'verify' | 'success'
  const [step, setStep] = useState('email');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Step 1: Request Reset Code
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid university email address.');
      return;
    }

    setLoading(true);
    const res = await requestForgotPassword(email.trim());
    setLoading(false);

    if (res.success) {
      setStep('verify');
      setCountdown(60);
      setSuccessMessage('Password reset code sent to your email.');
    } else {
      setErrorMessage(res.message || 'Failed to process password reset request.');
    }
  };

  // Step 2: Submit Reset OTP & New Password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (otp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    const res = await submitResetPassword(email.trim(), otp, newPassword);
    setLoading(false);

    if (res.success) {
      setStep('success');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } else {
      setErrorMessage(res.message || 'Failed to reset password. Code may be invalid or expired.');
    }
  };

  // Resend Reset OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await resendOtp(email.trim(), 'password_reset');
    setResending(false);

    if (res.success) {
      setCountdown(60);
      setSuccessMessage('A fresh password reset code has been sent.');
    } else {
      setErrorMessage(res.message || 'Failed to resend code.');
    }
  };

  return (
    <div
      className="w-full max-w-md mx-auto p-8 sm:p-10 rounded-3xl shadow-2xl border space-y-6 animate-fade-in"
      style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
    >
      
      {/* Brand Icon Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-sm">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl">
          {step === 'email' ? 'Reset Your Password' : step === 'verify' ? 'Enter Reset Code' : 'Password Reset'}
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          {step === 'email'
            ? 'Enter your registered university email to receive a secure 6-digit verification code.'
            : step === 'verify'
            ? `Enter the code sent to ${email} and choose a new password.`
            : 'Your password has been updated.'}
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && !errorMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* STEP 1: EMAIL REQUEST */}
      {step === 'email' && (
        <form onSubmit={handleRequestSubmit} className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">University Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="alex@university.edu"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <span>Sending Code...</span> : <span>Send Reset Code</span>}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}

      {/* STEP 2: VERIFY OTP & SET NEW PASSWORD */}
      {step === 'verify' && (
        <form onSubmit={handleResetSubmit} className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-center text-xs font-semibold text-slate-700 mb-2">
              6-Digit Reset Code
            </label>
            <OtpInput
              value={otp}
              onChange={(val) => { setOtp(val); setErrorMessage(''); }}
              disabled={loading}
              hasError={Boolean(errorMessage)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={newPassword}
                disabled={loading}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                disabled={loading}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <span>Updating Password...</span> : <span>Reset Password & Sign In</span>}
          </button>

          <div className="text-center pt-2 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Email</span>
            </button>

            {countdown > 0 ? (
              <span className="text-slate-400">Resend in {countdown}s</span>
            ) : (
              <button
                type="button"
                disabled={resending}
                onClick={handleResendOtp}
                className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                <span>Resend Code</span>
              </button>
            )}
          </div>
        </form>
      )}

      {/* STEP 3: SUCCESS */}
      {step === 'success' && (
        <div className="text-center py-6 space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="font-heading font-extrabold text-xl text-slate-900">
              Password Reset Successful!
            </h2>
            <p className="text-xs text-slate-500">
              Redirecting you to the sign-in page...
            </p>
          </div>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      )}

    </div>
  );
}
