import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OtpInput from '../components/OtpInput';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Building,
  UserPlus,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Clock,
  ShieldAlert
} from 'lucide-react';

export default function SignupPage() {
  const { signupStep1, verifySignupOtp, resendOtp, user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/app/dashboard';

  // Step state: 'details' | 'otp' | 'pending_approval' | 'success'
  const [step, setStep] = useState('details');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [departmentId, setDepartmentId] = useState('dep-cs');

  // OTP State
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // If already authenticated and not in OTP, redirect to dashboard
  useEffect(() => {
    if (token && user && step !== 'otp' && step !== 'pending_approval') {
      navigate('/app/dashboard', { replace: true });
    }
  }, [token, user, step, navigate]);

  // Resend Countdown
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Mask email helper
  const maskEmail = (val) => {
    if (!val || !val.includes('@')) return val;
    const [namePart, domain] = val.split('@');
    if (namePart.length <= 2) return `${namePart}***@${domain}`;
    return `${namePart.slice(0, 2)}***${namePart.slice(-1)}@${domain}`;
  };

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', text: 'text-red-600' };
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const passwordStrength = getPasswordStrength(password);

  // Department name lookup
  const deptNames = {
    'dep-cs': 'Computer Science & Software Eng',
    'dep-ee': 'Electrical & Computer Engineering',
    'dep-math': 'Mathematics & Data Science',
    'dep-phys': 'Physics & Applied Sciences'
  };

  // Step 1: Submit Details & Request Signup OTP
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('A valid university email address is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
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
      setStep('otp');
      setCountdown(60);
      setSuccessMessage(res.message || 'Verification code sent to your email.');
    } else {
      setErrorMessage(res.message || 'Registration failed. Please try again.');
    }
  };

  // Step 2: Submit OTP to Activate Account or Submit for Approval
  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    const res = await verifySignupOtp(email.trim(), otp);
    setLoading(false);

    if (res.success) {
      // If Moderator or Admin role, require Super Admin approval
      if (res.pendingApproval || role === 'moderator' || role === 'admin') {
        setStep('pending_approval');
        return;
      }

      // Students / Teachers proceed directly to dashboard
      setStep('success');
      setTimeout(() => {
        const newUser = res.user;
        let roleDashboard = redirectTarget;
        if (redirectTarget === '/app/dashboard' && newUser) {
          if (newUser.role === 'teacher') roleDashboard = '/app/teacher-dashboard';
          else if (newUser.role === 'moderator') roleDashboard = '/app/moderator-dashboard';
          else if (newUser.role === 'admin') roleDashboard = '/app/admin-dashboard';
        }
        navigate(roleDashboard, { replace: true });
      }, 1200);
    } else {
      setErrorMessage(res.message || 'Invalid or expired verification code.');
    }
  };

  // Resend Signup OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await resendOtp(email.trim(), 'signup');
    setResending(false);

    if (res.success) {
      setCountdown(60);
      setSuccessMessage('A fresh verification code has been sent.');
    } else {
      setErrorMessage(res.message || 'Failed to resend code. Please try again.');
    }
  };

  return (
    <div
      className="rounded-3xl shadow-2xl border grid grid-cols-1 md:grid-cols-12 overflow-hidden animate-fade-in"
      style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
    >
      
      {/* Left Branding Column */}
      <div className="md:col-span-5 bg-slate-900 text-white p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-violet-600/20 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-6">
          <Link to="/" className="inline-flex items-center gap-2.5 text-white font-heading font-extrabold text-lg">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/40">
              <BookOpen className="w-4 h-4" />
            </div>
            <span>AcademicHub</span>
          </Link>

          <div className="space-y-3 pt-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Join 15,000+ Scholars & Faculty
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl leading-tight">
              Create your verified academic profile.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Exchange lecture notes, study collaboratively with peers, get answers from professors, and supercharge your revision with AI tools.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Official university email OTP verification</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Moderator & Admin accounts verified by Super Admin</span>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="md:col-span-7 p-5 sm:p-8 flex flex-col justify-center" style={{ backgroundColor: 'var(--surface-card)' }}>
        <div className="max-w-md mx-auto w-full space-y-5">

          {/* STEP 1: REGISTRATION DETAILS */}
          {step === 'details' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h1 className="font-heading font-extrabold text-2xl text-slate-900">Create Account</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your university details to get started
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleDetailsSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      disabled={loading}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

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
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        disabled={loading}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        disabled={loading}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Password strength:</span>
                      <span className={`font-semibold ${passwordStrength.text}`}>{passwordStrength.label}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200'}`} />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                    <div className="relative">
                      <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={role}
                        disabled={loading}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="moderator">Moderator (Requires Approval)</option>
                        <option value="admin">Administrator (Requires Approval)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={departmentId}
                        disabled={loading}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="dep-cs">CompSci</option>
                        <option value="dep-ee">ElecEng</option>
                        <option value="dep-math">Math</option>
                        <option value="dep-phys">Physics</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Privileged Role Warning Notice */}
                {(role === 'moderator' || role === 'admin') && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2 animate-fade-in">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Privileged Role Notice:</strong> {role === 'admin' ? 'Administrator' : 'Moderator'} accounts require Super Admin approval before access is granted.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
                >
                  {loading ? (
                    <span>Generating Verification Code...</span>
                  ) : (
                    <>
                      <span>Continue to Email Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <span className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <Link
                      to={`/login${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect'))}` : ''}`}
                      className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      Sign In
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
                  onClick={() => { setStep('details'); setOtp(''); setErrorMessage(''); }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Information</span>
                </button>
                <h1 className="font-heading font-extrabold text-2xl text-slate-900">
                  Verify Your Email
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  We've sent a 6-digit confirmation code to{' '}
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
                    Enter 6-Digit Code
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
                      <UserPlus className="w-4 h-4" />
                      <span>Confirm & Submit Request</span>
                    </>
                  )}
                </button>

                {/* Resend OTP */}
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

          {/* STEP 3A: PENDING SUPER ADMIN APPROVAL */}
          {step === 'pending_approval' && (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-50">
                <Clock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Pending Super Admin Review</span>
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-slate-900">
                  Application Submitted
                </h2>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-800">{name}</strong>. Your email has been verified. Since you requested a privileged role (<strong className="capitalize text-indigo-600">{role}</strong>), your account requires approval by the Super Admin before you can sign in.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Return to Sign In
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}

          {/* STEP 3B: SUCCESS STATE (Active Student/Teacher) */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="font-heading font-extrabold text-2xl text-slate-900">
                  Account Verified & Activated!
                </h2>
                <p className="text-xs text-slate-500">
                  Welcome to AcademicHub, <strong className="text-slate-800">{name}</strong>. Redirecting to your dashboard...
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
