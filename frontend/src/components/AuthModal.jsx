import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OtpInput from './OtpInput';
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  Building,
  LogIn,
  UserPlus,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginStep1,
    verifyLoginOtp,
    signupStep1,
    verifySignupOtp,
    resendOtp
  } = useAuth();

  const navigate = useNavigate();

  // 'form' | 'otp' | 'success'
  const [modalStep, setModalStep] = useState('form');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [departmentId, setDepartmentId] = useState('dep-cs');

  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setModalStep('form');
    setOtp('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (authModalMode === 'login') {
      const res = await loginStep1(email.trim(), password);
      setLoading(false);
      if (res.success && res.requireOtp) {
        setModalStep('otp');
        setCountdown(45);
        setSuccessMessage(res.message || 'Verification code sent to your email.');
      } else if (res.success && !res.requireOtp) {
        setModalStep('success');
        setTimeout(() => {
          handleClose();
        }, 800);
      } else {
        setErrorMessage(res.message || 'Login failed. Please check your credentials.');
      }
    } else {
      const deptNames = {
        'dep-cs': 'Computer Science & Software Eng',
        'dep-ee': 'Electrical & Computer Engineering',
        'dep-math': 'Mathematics & Data Science',
        'dep-phys': 'Physics & Applied Sciences'
      };
      const res = await signupStep1({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        departmentId,
        departmentName: deptNames[departmentId] || 'Computer Science'
      });
      setLoading(false);
      if (res.success && res.requireOtp) {
        setModalStep('otp');
        setCountdown(60);
        setSuccessMessage(res.message || 'Verification code sent to your email.');
      } else {
        setErrorMessage(res.message || 'Registration failed. Please try again.');
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit code.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    let res;
    if (authModalMode === 'login') {
      res = await verifyLoginOtp(email.trim(), otp);
    } else {
      res = await verifySignupOtp(email.trim(), otp);
    }
    setLoading(false);

    if (res.success) {
      setModalStep('success');
      setTimeout(() => {
        handleClose();
        navigate('/app/dashboard');
      }, 1000);
    } else {
      setErrorMessage(res.message || 'Invalid or expired verification code.');
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setErrorMessage('');
    const res = await resendOtp(email.trim(), authModalMode === 'login' ? 'login' : 'signup');
    setResending(false);
    if (res.success) {
      setCountdown(authModalMode === 'login' ? 45 : 60);
      setSuccessMessage('A fresh verification code has been sent.');
    } else {
      setErrorMessage(res.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="rounded-3xl shadow-2xl border w-full max-w-md overflow-hidden transform transition-all"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        
        {/* Header */}
        <div
          className="px-6 py-5 flex justify-between items-center relative border-b"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              {authModalMode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {modalStep === 'otp'
                  ? 'Verify 6-Digit Code'
                  : authModalMode === 'login'
                  ? 'Sign In to AcademicHub'
                  : 'Create an Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {modalStep === 'otp'
                  ? 'Enter code sent to your university email'
                  : authModalMode === 'login'
                  ? 'Access course notes, Q&A, and study resources'
                  : 'Join students and faculty across departments'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 mb-4 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && !errorMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2 mb-4 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: FORM */}
          {modalStep === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {authModalMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Alex Morgan"
                      value={name}
                      disabled={loading}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      style={{
                        backgroundColor: 'var(--surface-input)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>University Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    disabled={loading}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    style={{
                      backgroundColor: 'var(--surface-input)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Password</label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        navigate('/forgot-password');
                      }}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    disabled={loading}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs placeholder-slate-400 border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    style={{
                      backgroundColor: 'var(--surface-input)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              {authModalMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Role</label>
                    <div className="relative">
                      <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={role}
                        disabled={loading}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full pl-9 pr-2 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                        style={{
                          backgroundColor: 'var(--surface-input)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Department</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={departmentId}
                        disabled={loading}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="w-full pl-9 pr-2 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                        style={{
                          backgroundColor: 'var(--surface-input)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <option value="dep-cs">CompSci</option>
                        <option value="dep-ee">ElecEng</option>
                        <option value="dep-math">Math</option>
                        <option value="dep-phys">Physics</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : authModalMode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" /> <span>Continue to 2FA</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> <span>Create Account</span>
                  </>
                )}
              </button>

              {/* Toggle Mode */}
              <div
                className="pt-3 text-center text-xs border-t flex items-center justify-between"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                {authModalMode === 'login' ? (
                  <>
                    <span>
                      Need an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setAuthModalMode('register'); setErrorMessage(''); }}
                        className="text-indigo-600 font-bold hover:underline cursor-pointer"
                      >
                        Register
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={() => { handleClose(); navigate('/login'); }}
                      className="hover:underline flex items-center gap-0.5 text-[11px] cursor-pointer"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <span>Full screen</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <span>
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => { setAuthModalMode('login'); setErrorMessage(''); }}
                        className="text-indigo-600 font-bold hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={() => { handleClose(); navigate('/signup'); }}
                      className="hover:underline flex items-center gap-0.5 text-[11px] cursor-pointer"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <span>Full screen</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </form>
          )}

          {/* STEP 2: OTP */}
          {modalStep === 'otp' && (
            <div className="space-y-4 animate-fade-in">
              <button
                type="button"
                onClick={() => { setModalStep('form'); setOtp(''); setErrorMessage(''); }}
                className="inline-flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to credentials</span>
              </button>

              <OtpInput
                value={otp}
                onChange={(val) => { setOtp(val); setErrorMessage(''); }}
                disabled={loading}
                hasError={Boolean(errorMessage)}
              />

              <button
                type="button"
                disabled={loading || otp.length !== 6}
                onClick={handleOtpSubmit}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <span>Verifying...</span> : <span>Verify & Access Workspace</span>}
              </button>

              <div className="text-center pt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                {countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    disabled={resending}
                    onClick={handleResendOtp}
                    className="font-bold text-indigo-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                    <span>Resend Code</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {modalStep === 'success' && (
            <div className="text-center py-6 space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-heading font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Authentication Confirmed!
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Entering academic workspace...
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
