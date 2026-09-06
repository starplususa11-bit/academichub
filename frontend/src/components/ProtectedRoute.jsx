import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccessDenied from '../components/AccessDenied';
import { BookOpen } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  // Show a professional loading state while verifying authentication
  // This completely eliminates navbar flickering or dashboard flashing
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans p-4">
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 animate-pulse">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-heading font-extrabold text-lg text-white tracking-tight">
              Academic<span className="text-indigo-400">Hub</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">Securing session...</p>
          </div>
          <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-full h-full bg-indigo-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to login with redirect param
  if (!token || !user) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  // If allowedRoles is provided, ensure the user's role is permitted
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <AccessDenied />;
    }
  }

  return children;
}
