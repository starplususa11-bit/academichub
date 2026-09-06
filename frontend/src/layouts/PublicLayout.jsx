import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, ArrowRight, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function PublicLayout() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
    >
      {/* Public Header Navbar */}
      <header className="sticky top-0 z-40 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <span
                className="font-heading font-extrabold text-lg tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Academic<span style={{ color: 'var(--brand-primary)' }}>Hub</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <nav
              className="hidden md:flex items-center gap-8 text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              <a
                href="#features"
                className="transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.target.style.color = 'var(--brand-primary)'; }}
                onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; }}
              >
                Platform Features
              </a>
              <a
                href="#ai-study"
                className="transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.target.style.color = 'var(--brand-primary)'; }}
                onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; }}
              >
                AI Study Suite
              </a>
              <a
                href="#faq"
                className="transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.target.style.color = 'var(--brand-primary)'; }}
                onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; }}
              >
                FAQ
              </a>
            </nav>

            {/* Auth Actions + Theme Toggle */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {!token ? (
                <>
                  <Link
                    to="/login"
                    className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 border"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <LogIn className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                    <span className="hidden xs:inline sm:inline">Sign In</span>
                    <span className="xs:hidden sm:hidden">Login</span>
                  </Link>

                  <Link
                    to="/signup"
                    className="px-2.5 sm:px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1 shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Get Started</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/app/dashboard"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Public Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer
        className="border-t py-12 mt-auto"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="space-y-3 md:col-span-2">
            <div
              className="flex items-center gap-2 font-heading font-extrabold text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              <BookOpen className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
              <span>AcademicHub</span>
            </div>
            <p className="max-w-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              The centralized academic workspace for students and faculty. Discover lecture notes, ask coursework questions, and study smarter with AI.
            </p>
          </div>
          <div>
            <h4
              className="font-heading font-bold mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Platform
            </h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:underline" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e)=>e.target.style.color='var(--brand-primary)'} onMouseLeave={(e)=>e.target.style.color='var(--text-muted)'}>Sign In</Link></li>
              <li><Link to="/signup" className="hover:underline" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e)=>e.target.style.color='var(--brand-primary)'} onMouseLeave={(e)=>e.target.style.color='var(--text-muted)'}>Create Account</Link></li>
              <li><a href="#features" className="hover:underline" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e)=>e.target.style.color='var(--brand-primary)'} onMouseLeave={(e)=>e.target.style.color='var(--text-muted)'}>Features</a></li>
              <li><a href="#ai-study" className="hover:underline" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e)=>e.target.style.color='var(--brand-primary)'} onMouseLeave={(e)=>e.target.style.color='var(--text-muted)'}>AI Assistant</a></li>
            </ul>
          </div>
          <div>
            <h4
              className="font-heading font-bold mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Academic Disciplines
            </h4>
            <ul className="space-y-2" style={{ color: 'var(--text-muted)' }}>
              <li><span>Computer Science &amp; Software Eng</span></li>
              <li><span>Electrical Engineering</span></li>
              <li><span>Mathematics &amp; Data Science</span></li>
              <li><span>Physics &amp; Applied Sciences</span></li>
            </ul>
          </div>
        </div>
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t text-center text-xs"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          © {new Date().getFullYear()} AcademicHub. All rights reserved. Built for higher education excellence.
        </div>
      </footer>

    </div>
  );
}
