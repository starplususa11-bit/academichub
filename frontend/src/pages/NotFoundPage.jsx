import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Home, ArrowLeft, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotFoundPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center antialiased">
      {/* Brand Icon */}
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
        <BookOpen className="w-8 h-8" />
      </div>

      {/* 404 Visual Graphic */}
      <div className="relative mb-6">
        <span className="font-heading font-black text-8xl sm:text-9xl text-slate-200 tracking-tighter select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 shadow-xs uppercase tracking-wider">
            Page Not Found
          </span>
        </div>
      </div>

      {/* Descriptive Message */}
      <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-2">
        Looking for academic material?
      </h1>
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
        The page or learning resource you requested could not be found, was renamed, or has moved to a new section.
      </p>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <Link
          to={token ? '/app/dashboard' : '/'}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all"
        >
          <Home className="w-4 h-4" />
          <span>{token ? 'Back to Dashboard' : 'Back to Home'}</span>
        </Link>

        {token && (
          <Link
            to="/app/resources"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold shadow-xs transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Browse Resources</span>
          </Link>
        )}
      </div>
    </div>
  );
}
