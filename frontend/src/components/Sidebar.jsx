import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../context/ResourceContext';
import {
  Home,
  BookOpen,
  FolderCheck,
  Sparkles,
  HelpCircle,
  Users,
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
  Layers,
  GraduationCap,
  ChevronRight,
  BookMarked
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const { departments } = useResources();

  // Navigation Items according to active persona
  const getNavItems = () => {
    const common = [
      { path: '/', label: 'Home Feed', icon: Home },
      { path: '/resources', label: 'Browse Resources', icon: BookOpen },
      { path: '/qa', label: 'Academic Q&A', icon: HelpCircle },
      { path: '/groups', label: 'Study Groups', icon: Users },
    ];

    if (user.role === 'student') {
      return [
        ...common,
        { path: '/student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
        { path: '/bookmarks', label: 'Saved Bookmarks', icon: BookMarked },
      ];
    }

    if (user.role === 'teacher') {
      return [
        ...common,
        { path: '/teacher-dashboard', label: 'Teacher Portal', icon: GraduationCap },
        { path: '/course-resources', label: 'Course Materials', icon: Layers },
      ];
    }

    if (user.role === 'moderator') {
      return [
        ...common,
        { path: '/moderator-dashboard', label: 'Moderation Desk', icon: ShieldCheck, badge: '1 Pending' },
      ];
    }

    if (user.role === 'admin') {
      return [
        ...common,
        { path: '/admin-dashboard', label: 'Admin Panel', icon: BarChart3 },
      ];
    }

    return common;
  };

  const navItems = getNavItems();

  return (
    <aside className="w-60 shrink-0 hidden md:block">
      <div className="sticky top-20 space-y-5 pr-2">

        {/* Primary Navigation Menu */}
        <div
          className="rounded-2xl p-2.5 border shadow-xs"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)'
          }}
        >
          <div
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 pb-2 pt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Navigation
          </div>
          <nav className="space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-500/15 text-indigo-400 font-semibold border border-indigo-500/20 shadow-xs'
                        : 'hover:opacity-80'
                    }`
                  }
                  style={({ isActive }) =>
                    !isActive
                      ? {
                          color: 'var(--text-secondary)',
                        }
                      : {}
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Academic Departments Quick Filter */}
        <div
          className="rounded-2xl p-2.5 border shadow-xs"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)'
          }}
        >
          <div
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 pb-2 pt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Departments
          </div>
          <div className="space-y-0.5">
            {departments.map(dept => (
              <NavLink
                key={dept.id}
                to={`/resources?department=${dept.id}`}
                className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors hover:text-indigo-400"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="truncate">{dept.name}</span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {dept.code}
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Platform Purpose Card */}
        <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xs space-y-1.5 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Hub 2.0</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Organized academic workspace for verified lecture notes, course Q&A, and AI study suites.
          </p>
        </div>

      </div>
    </aside>
  );
}
