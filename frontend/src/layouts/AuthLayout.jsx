import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
    >
      {/* Ambient background glows — subtle in light, vivid in dark via opacity */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
          opacity: 0.3,
        }}
      />

      {/* Minimal Standalone Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:bg-indigo-500 transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span
                className="font-heading font-extrabold text-xl tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Academic<span style={{ color: 'var(--brand-primary)' }}>Hub</span>
              </span>
              <span
                className="text-[10px] uppercase font-semibold tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Academic Workspace
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Security badge */}
            <div
              className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border backdrop-blur-sm"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
              <span>256-Bit SSL Secured Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Minimal Standalone Footer */}
      <footer
        className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-3 border-t"
        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
      >
        <div>
          © {new Date().getFullYear()} AcademicHub Platform. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link
            to="/"
            className="transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; }}
          >
            Home
          </Link>
          <span style={{ color: 'var(--border-default)' }}>•</span>
          <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <Sparkles className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />
            Higher Education Security Standards
          </span>
        </div>
      </footer>
    </div>
  );
}
