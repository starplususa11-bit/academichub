import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../context/ResourceContext';
import {
  Search,
  Upload,
  Bell,
  BookOpen,
  Sparkles,
  User,
  LogOut,
  CheckCircle2,
  Command,
  ChevronDown,
  Settings
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, notifications, token, logout, canUpload } = useAuth();
  const { searchQuery, setSearchQuery, setIsUploadOpen, setActiveAiResource } = useResources();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut for search: Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/app/resources');
  };

  const handleSignOut = () => {
    logout();
    setShowUserMenu(false);
    navigate('/', { replace: true });
  };

  return (
    <header
      className="sticky top-0 z-30 glass-header shadow-xs"
      style={{ boxShadow: 'var(--shadow-xs)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link to={token ? '/app/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span
                  className="font-heading font-extrabold text-lg tracking-tight leading-none flex items-center gap-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Academic<span style={{ color: 'var(--brand-primary)' }}>Hub</span>
                </span>
                <span
                  className="text-[10px] font-medium tracking-wider uppercase mt-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Academic Workspace
                </span>
              </div>
            </Link>
          </div>

          {/* Global Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <Search
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search notes, questions, past papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-12 py-2 text-xs rounded-xl border transition-all focus:outline-none"
              style={{
                backgroundColor: 'var(--surface-input)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-subtle)',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'var(--surface-input-focus)';
                e.target.style.borderColor = 'var(--border-focus)';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'var(--surface-input)';
                e.target.style.borderColor = 'var(--border-subtle)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[10px] font-mono"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </form>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* AI Study Shortcut */}
            <button
              onClick={() => navigate('/app/ai-study')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
              style={{
                backgroundColor: 'var(--brand-light)',
                borderColor: 'rgba(99, 102, 241, 0.2)',
                color: 'var(--brand-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--brand-light)';
              }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" style={{ color: 'var(--brand-primary)' }} />
              <span>AI Study</span>
            </button>

            {/* Upload Button */}
            {canUpload && (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative" data-dropdown>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                className="relative p-2 rounded-xl transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications?.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2"
                    style={{ ringColor: 'var(--surface-card)' }} />
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-2xl p-3 z-50 animate-fade-in border"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-subtle)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  <div
                    className="flex items-center justify-between pb-2 border-b"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <span
                      className="font-heading font-semibold text-xs"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Notifications
                    </span>
                    <span
                      className="text-[10px] font-medium cursor-pointer hover:underline"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      Mark all read
                    </span>
                  </div>
                  <div
                    className="max-h-64 overflow-y-auto mt-1"
                    style={{ borderTop: 'none' }}
                  >
                    {notifications?.length > 0 ? notifications.map(n => (
                      <div
                        key={n.id}
                        className="py-2 px-1 rounded-lg transition-colors cursor-pointer"
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                            <p className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                            <span className="text-[9px] mt-0.5 block" style={{ color: 'var(--text-muted)' }}>{n.time}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>No notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div
              className="relative pl-2 border-l"
              style={{ borderColor: 'var(--border-subtle)' }}
              data-dropdown
            >
              <div className="relative">
                <button
                  onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                  className="flex items-center gap-2 p-1 rounded-xl transition-colors"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="hidden md:block text-left">
                    <span className="block text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{user?.name}</span>
                    <span className="block text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>{user?.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 hidden md:block" style={{ color: 'var(--text-muted)' }} />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl p-1 z-50 animate-fade-in border"
                    style={{
                      backgroundColor: 'var(--surface-card)',
                      borderColor: 'var(--border-subtle)',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  >
                    <div
                      className="px-3 py-2.5 border-b"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                      <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>

                    <div className="p-1 space-y-0.5 mt-1">
                      <button
                        onClick={() => { navigate('/app/profile'); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>My Profile</span>
                      </button>

                      <button
                        onClick={() => { navigate('/app/settings'); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Settings</span>
                      </button>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-500 transition-colors text-left"
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-error-bg)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
