import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('academichub_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingAuth, setPendingAuth] = useState(null); // { email, type, expiresAt }

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  const [notifications, setNotifications] = useState([
    { id: "n1", title: "New Resource Approved", message: "Operating Systems Notes passed moderation", time: "10m ago", read: false },
    { id: "n2", title: "Answer Accepted", message: "Dr. Robert Chen answered your question on AVL trees", time: "1h ago", read: false }
  ]);

  // Load and verify user on mount or when token changes
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const storedToken = localStorage.getItem('academichub_token');
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (isMounted && res.data.success && res.data.user) {
          setUser(res.data.user);
          setToken(storedToken);
        } else {
          throw new Error('Session invalid');
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.response?.data?.message || err.message);
        if (isMounted) {
          localStorage.removeItem('academichub_token');
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Step 1: Initiate login with email & password
   */
  const loginStep1 = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        if (res.data.requireOtp) {
          setPendingAuth({
            email: res.data.email,
            type: 'login',
            expiresAt: res.data.expiresAt
          });
          return {
            success: true,
            requireOtp: true,
            email: res.data.email,
            message: res.data.message
          };
        } else if (res.data.token) {
          // Direct login without OTP (e.g., Super Admin bypass)
          const { token: jwtToken, user: authenticatedUser } = res.data;
          localStorage.setItem('academichub_token', jwtToken);
          setToken(jwtToken);
          setUser(authenticatedUser);
          setPendingAuth(null);
          setIsAuthModalOpen(false);
          return {
            success: true,
            requireOtp: false,
            user: authenticatedUser,
            token: jwtToken,
            message: res.data.message
          };
        }
      }
      return { success: false, message: 'Unexpected login response from server.' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  /**
   * Step 2: Complete login with 6-digit OTP
   */
  const verifyLoginOtp = async (email, otp) => {
    try {
      const res = await api.post('/auth/verify-login-otp', { email, otp });
      if (res.data.success) {
        const { token: jwtToken, user: authenticatedUser } = res.data;
        if (jwtToken) {
          localStorage.setItem('academichub_token', jwtToken);
          setToken(jwtToken);
        }
        setUser(authenticatedUser);
        setPendingAuth(null);
        setIsAuthModalOpen(false);
        return { success: true, user: authenticatedUser, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Verification failed.' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid or expired verification code.',
        attemptsRemaining: err.response?.data?.attemptsRemaining
      };
    }
  };

  /**
   * Step 1: Initiate signup with registration fields
   */
  const signupStep1 = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        if (res.data.requireOtp) {
          setPendingAuth({
            email: res.data.email,
            type: 'signup',
            expiresAt: res.data.expiresAt
          });
          return {
            success: true,
            requireOtp: true,
            email: res.data.email,
            message: res.data.message
          };
        }
      }
      return { success: false, message: 'Unexpected registration response.' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  /**
   * Step 2: Complete signup with 6-digit OTP
   */
  const verifySignupOtp = async (email, otp) => {
    try {
      const res = await api.post('/auth/verify-signup-otp', { email, otp });
      if (res.data.success) {
        const { token: jwtToken, user: newUser } = res.data;
        if (jwtToken) {
          localStorage.setItem('academichub_token', jwtToken);
          setToken(jwtToken);
        }
        setUser(newUser);
        setPendingAuth(null);
        setIsAuthModalOpen(false);
        return { success: true, user: newUser, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Verification failed.' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid or expired verification code.',
        attemptsRemaining: err.response?.data?.attemptsRemaining
      };
    }
  };

  /**
   * Resend OTP for either signup, login, or password reset
   */
  const resendOtp = async (email, type) => {
    try {
      const res = await api.post('/auth/resend-otp', { email, type });
      return {
        success: true,
        message: res.data.message || 'Verification code resent successfully.',
        expiresAt: res.data.expiresAt
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to resend code. Please wait before retrying.'
      };
    }
  };

  /**
   * Forgot password request
   */
  const requestForgotPassword = async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to process password reset request.'
      };
    }
  };

  /**
   * Reset password with OTP
   */
  const submitResetPassword = async (email, otp, newPassword) => {
    try {
      const res = await api.post('/auth/reset-password', { email, otp, newPassword });
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to reset password.'
      };
    }
  };

  /**
   * Legacy login alias for existing modal compatibility if called directly
   */
  const login = async (email, password) => {
    return await loginStep1(email, password);
  };

  /**
   * Legacy register alias for existing modal compatibility if called directly
   */
  const register = async (userData) => {
    return await signupStep1(userData);
  };

  /**
   * Sign out and clear all credentials
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setPendingAuth(null);
    localStorage.removeItem('academichub_token');
  }, []);

  /**
   * Demo persona switcher
   */
  const switchRole = async (newRole) => {
    try {
      const res = await api.post('/auth/switch-role', { role: newRole });
      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.token) {
          setToken(res.data.token);
          localStorage.setItem('academichub_token', res.data.token);
        }
      }
    } catch (e) {
      console.warn('Switch role API failed:', e.message);
    }
  };

  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const isSuperAdmin = Boolean(
    user?.isSuperAdmin ||
    user?.username === 'awaisdemo123' ||
    (user?.email && user.email.toLowerCase() === 'criminalmostwanted517@gmail.com')
  );

  // Students have view-only access. Only approved moderators, admins, teachers, and super admin can upload content.
  const canUpload = Boolean(
    user &&
    (isSuperAdmin ||
      ((user.role === 'admin' || user.role === 'moderator' || user.role === 'teacher') &&
        user.status === 'active' &&
        user.isApproved !== false)) &&
    user.role !== 'student'
  );

  // Can create collaborative study groups: Admin, Super Admin, Teacher, Moderator
  const canCreateGroup = Boolean(
    user &&
    (isSuperAdmin ||
      ((user.role === 'admin' || user.role === 'moderator' || user.role === 'teacher') &&
        user.status === 'active' &&
        user.isApproved !== false)) &&
    user.role !== 'student'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        pendingAuth,
        setPendingAuth,
        isSuperAdmin,
        canUpload,
        canCreateGroup,
        login,
        loginStep1,
        verifyLoginOtp,
        register,
        signupStep1,
        verifySignupOtp,
        resendOtp,
        requestForgotPassword,
        submitResetPassword,
        logout,
        switchRole,
        notifications,
        setNotifications,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLoginModal,
        openRegisterModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
