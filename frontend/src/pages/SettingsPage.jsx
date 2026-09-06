import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings, Bell, Globe, Shield, LogOut, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [language, setLanguage] = useState('en');

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* Header */}
      <div
        className="academic-card p-6"
        style={{ color: 'var(--text-primary)' }}
      >
        <h1 className="font-heading font-extrabold text-lg flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Settings className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
          Settings
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Manage your account preferences and notifications
        </p>
      </div>

      {/* Appearance / Theme */}
      <div className="academic-card p-6 space-y-4">
        <h2 className="font-heading font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          {isDark ? <Moon className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} /> : <Sun className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />}
          Appearance
        </h2>
        <div
          className="flex items-center justify-between p-4 rounded-xl border"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {isDark ? 'Comfortable dark interface active' : 'Clean light interface active'}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            style={{ backgroundColor: isDark ? 'var(--toggle-track-on)' : 'var(--toggle-track-off)' }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 flex items-center justify-center"
              style={{ transform: isDark ? 'translateX(20px)' : 'translateX(0)' }}
            >
              {isDark
                ? <Moon className="w-2.5 h-2.5 text-indigo-600" />
                : <Sun className="w-2.5 h-2.5 text-amber-500" />
              }
            </span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="academic-card p-6 space-y-4">
        <h2 className="font-heading font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Bell className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
          Notification Preferences
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Email Notifications', description: 'Receive updates about resources and Q&A answers', value: emailNotifs, set: setEmailNotifs },
            { label: 'Push Notifications', description: 'Browser push alerts for real-time activity', value: pushNotifs, set: setPushNotifs },
          ].map(({ label, description, value, set }) => (
            <div
              key={label}
              className="flex items-center justify-between p-3 rounded-xl border"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
            >
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{description}</p>
              </div>
              <button
                onClick={() => set(!value)}
                className="relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none"
                style={{ backgroundColor: value ? 'var(--toggle-track-on)' : 'var(--toggle-track-off)' }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300"
                  style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="academic-card p-6 space-y-4">
        <h2 className="font-heading font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Globe className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
          Language
        </h2>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="w-full max-w-xs text-xs p-2.5 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          style={{
            backgroundColor: 'var(--surface-input)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="en">English (US)</option>
          <option value="ur">Urdu</option>
          <option value="ar">Arabic</option>
        </select>
      </div>

      {/* Danger Zone */}
      <div className="academic-card p-6 space-y-4" style={{ borderColor: 'var(--color-error-border)' }}>
        <h2 className="font-heading font-bold text-sm flex items-center gap-2 text-red-500">
          <Shield className="w-4 h-4" /> Account Actions
        </h2>
        <div
          className="p-4 rounded-xl border"
          style={{ backgroundColor: 'var(--color-error-bg)', borderColor: 'var(--color-error-border)' }}
        >
          <p className="text-xs font-semibold" style={{ color: 'var(--color-error-text)' }}>Sign Out</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-error-text)' }}>
            You will be redirected to the landing page.
          </p>
          <button
            onClick={logout}
            className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of AcademicHub</span>
          </button>
        </div>
      </div>
    </div>
  );
}
