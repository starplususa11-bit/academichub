import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OtpInput from '../components/OtpInput';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const { loginStep1, verifyLoginOtp, resendOtp, user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/app/dashboard';

  // Step state: 'credentials' | 'otp' | 'success'
  const [step, setStep] = useState('credentials');
  
  // Credentials form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP state
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  // UX states
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // If already authenticated and not in OTP verification, redirect to dashboard
  useEffect(() => {
    if (token && user && step !== 'otp') {
      const target = user.role === 'teacher' ? '/app/teacher-dashboard' :
                     user.role === 'moderator' ? '/app/moderator-dashboard' :
                     user.role === 'admin' ? '/app/admin-dashboard' : '/app/dashboard';
      navigate(target, { replace: true });
    }
  }, [token, user, step, navigate]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Mask email for privacy
  const maskEmail = (val) => {
    if (!val || !val.includes('@')) return val;
    const [namePart, domain] = val.split('@');
    if (namePart.length <= 2) return `${namePart}***@${domain}`;
    return `${namePart.slice(0, 2)}***${namePart.slice(-1)}@${domain}`;
  };

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const res = await loginStep1(email.trim(), password);
    setLoading(false);

    if (res.success && res.requireOtp) {
      setStep('otp');
      setCountdown(45);
      setSuccessMessage(res.message || 'Verification code sent to your email.');
    } else if (res.success && !res.requireOtp) {
      setStep('success');
      setTimeout(() => {
        const authenticatedUser = res.user;
        let roleDashboard = redirectTarget;
        if (redirectTarget === '/app/dashboard' && authenticatedUser) {
          if (authenticatedUser.role === 'teacher') roleDashboard = '/app/teacher-dashboard';
          else if (authenticatedUser.role === 'moderator') roleDashboard = '/app/moderator-dashboard';
          else if (authenticatedUser.role === 'admin') roleDashboard = '/app/admin-dashboard';
        }
        navigate(roleDashboard, { replace: true });
      }, 800);
    } else {
      setErrorMessage(res.message || 'Login failed. Please check your credentials.');
    }
  };

  // Step 2: Submit OTP
  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    const res = await verifyLoginOtp(email.trim(), otp);
    setLoading(false);

    if (res.success) {
      setStep('success');
      setTimeout(() => {
        const authenticatedUser = res.user;
        let roleDashboard = redirectTarget;
        if (redirectTarget === '/app/dashboard' && authenticatedUser) {
          if (authenticatedUser.role === 'teacher') roleDashboard = '/app/teacher-dashboard';
          else if (authenticatedUser.role === 'moderator') roleDashboard = '/app/moderator-dashboard';
          else if (authenticatedUser.role === 'admin') roleDashboard = '/app/admin-dashboard';
        }
        navigate(roleDashboard, { replace: true });
      }, 1000);
    } else {
      setErrorMessage(res.message || 'Invalid or expired verification code.');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await resendOtp(email.trim(), 'login');
    setResending(false);

    if (res.success) {
      setCountdown(45);
      setSuccessMessage('A fresh verification code has been sent.');
    } else {
      setErrorMessage(res.message || 'Failed to resend code. Please try again in a moment.');
    }
  };


  return (
    <div
      className="rounded-3xl shadow-2xl border grid grid-cols-1 md:grid-cols-12 overflow-hidden animate-fade-in"
      style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
    >
      
      {/* Left Branding Column */}
      <div className="md:col-span-5 bg-slate-900 text-white p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-600/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-violet-600/20 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-6">
          <Link to="/" className="inline-flex items-center gap-2.5 text-white font-heading font-extrabold text-lg">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/40">
              <BookOpen className="w-4 h-4" />
            </div>
            <span>AcademicHub</span>
          </Link>

          <div className="space-y-3 pt-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-semibold text-indigo-300">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Two-Factor Authentication Protected
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl leading-tight">
              Welcome back to your academic workspace.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Secure access to verified course materials, department archives, collaborative study sessions, and AI summaries.
            </p>
          </div>
        </div>

        {/* Security Assurance Footer */}
        <div className="relative z-10 pt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>256-Bit SSL Encrypted Session</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Automated 2-Factor Email OTP Protection</span>
          </div>
        </div>

      </div>

      {/* Right Form Column */}
      <div className="md:col-span-7 p-5 sm:p-8 flex flex-col justify-center" style={{ backgroundColor: 'var(--surface-card)' }}>
        <div className="max-w-md mx-auto w-full space-y-6">

          {/* STEP 1: CREDENTIALS */}
          {step === 'credentials' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="font-heading font-extrabold text-2xl text-slate-900">Sign In</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your registered university email and password
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    University Email or Username
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your email or username"
                      value={email}
                      disabled={loading}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      disabled={loading}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Continue with 2FA</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <span className="text-xs text-slate-500">
                    Don't have an account yet?{' '}
                    <Link
                      to={`/signup${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect'))}` : ''}`}
                      className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      Create Free Account
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <button
                  type="button"
                  onClick={() => { setStep('credentials'); setOtp(''); setErrorMessage(''); }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>
                <h1 className="font-heading font-extrabold text-2xl text-slate-900">
                  Verify Sign In
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  We've sent a 6-digit security code to{' '}
                  <strong className="text-slate-800 font-semibold">{maskEmail(email)}</strong>
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

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <label className="block text-center text-xs font-semibold text-slate-700 mb-2">
                    Enter 6-Digit Verification Code
                  </label>
                  <OtpInput
                    value={otp}
                    onChange={(val) => { setOtp(val); setErrorMessage(''); }}
                    onComplete={() => {}}
                    disabled={loading}
                    hasError={Boolean(errorMessage)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Verify & Access Workspace</span>
                    </>
                  )}
                </button>

                {/* Resend OTP & Countdown */}
                <div className="text-center pt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
                  {countdown > 0 ? (
                    <span className="font-medium text-slate-400">
                      Resend code in <strong className="text-slate-600">{countdown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={resending}
                      onClick={handleResendOtp}
                      className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                      <span>Resend Verification Code</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="font-heading font-extrabold text-2xl text-slate-900">
                  Sign In Verified!
                </h2>
                <p className="text-xs text-slate-500">
                  Preparing your academic workspace...
                </p>
              </div>
              <div className="w-24 h-1 bg-slate-100 rounded-full mx-auto overflow-hidden">
                <div className="w-full h-full bg-emerald-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
