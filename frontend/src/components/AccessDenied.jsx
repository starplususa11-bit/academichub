import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied() {
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-6">
      <div className="max-w-md text-center p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <ShieldAlert className="w-12 h-12 mx-auto text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
        <p className="text-slate-600 mb-4">
          You do not have permission to view this page. This resource is restricted to{' '}
          {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}s` : 'authorized users'}.
        </p>
        <Link
          to="/app/dashboard"
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
