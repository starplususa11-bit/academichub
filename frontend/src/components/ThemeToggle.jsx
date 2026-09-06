import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeToggle — compact Sun/Moon icon button.
 * Drops into any navbar with zero layout disruption.
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`
        relative p-2 rounded-xl transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500/30
        group cursor-pointer
        ${className}
      `}
      style={{
        color: 'var(--text-secondary)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
        e.currentTarget.style.color = 'var(--text-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      {/* Sun icon — visible in light mode */}
      <Sun
        className={`w-4 h-4 absolute inset-0 m-auto transition-all duration-300 ${
          isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-75'
        }`}
        style={{ color: isDark ? '#FCD34D' : 'currentColor' }}
      />

      {/* Moon icon — visible in dark mode */}
      <Moon
        className={`w-4 h-4 absolute inset-0 m-auto transition-all duration-300 ${
          isDark
            ? 'opacity-0 rotate-90 scale-75'
            : 'opacity-100 rotate-0 scale-100'
        }`}
      />

      {/* Spacer to maintain button size */}
      <span className="w-4 h-4 block invisible" aria-hidden />
    </button>
  );
}
