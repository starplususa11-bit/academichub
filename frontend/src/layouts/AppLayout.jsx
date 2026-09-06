import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PDFViewerModal from '../components/PDFViewerModal';
import AIStudyModal from '../components/AIStudyModal';
import UploadResourceModal from '../components/UploadResourceModal';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../context/ResourceContext';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  Users,
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
  GraduationCap,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { departments } = useResources();
  const navigate = useNavigate();

  const getNavItems = () => {
    const common = [
      { path: '/app/dashboard',  label: 'Dashboard',      icon: LayoutDashboard },
      { path: '/app/resources',  label: 'Resources',       icon: BookOpen },
      { path: '/app/qa',         label: 'Q&A Forum',       icon: HelpCircle },
      { path: '/app/groups',     label: 'Study Groups',    icon: Users },
      { path: '/app/ai-study',   label: 'AI Study Suite',  icon: Sparkles, highlight: true },
    ];

    if (user?.role === 'teacher') {
      return [...common, { path: '/app/teacher-dashboard',  label: 'Teacher Portal',   icon: GraduationCap }];
    }
    if (user?.role === 'moderator') {
      return [...common, { path: '/app/moderator-dashboard', label: 'Moderation Desk', icon: ShieldCheck, badge: '1 Pending' }];
    }
    if (user?.role === 'admin') {
      return [...common, { path: '/app/admin-dashboard',    label: 'Admin Panel',       icon: BarChart3 }];
    }
    return common;
  };

  const navItems = getNavItems();

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
    >
      {/* Authenticated Application Header */}
      <Navbar />

      {/* Application Content Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 flex-1">

        {/* Compact App Sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="sticky top-20 space-y-5 pr-1">

            {/* Main Navigation Section */}
            <div
              className="rounded-2xl p-2.5 border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 pb-2 pt-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Main Workspace
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
                          isActive ? 'nav-item-active' : 'nav-item-inactive'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${item.highlight ? '' : ''}`}
                          style={item.highlight ? { color: 'var(--brand-primary)' } : {}} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className="px-2 py-0.5 text-[9px] font-bold rounded-full"
                          style={{
                            backgroundColor: 'var(--color-warning-bg)',
                            color: 'var(--color-warning-text)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Account & Profile Menu */}
            <div
              className="rounded-2xl p-2.5 border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 pb-2 pt-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Account
              </div>
              <nav className="space-y-0.5">
                <NavLink
                  to="/app/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive ? 'nav-item-active' : 'nav-item-inactive'
                    }`
                  }
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </NavLink>

                <NavLink
                  to="/app/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive ? 'nav-item-active' : 'nav-item-inactive'
                    }`
                  }
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </NavLink>

                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-500 transition-all text-left"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-error-bg)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>

            {/* Department Shortcuts */}
            <div
              className="rounded-2xl p-2.5 border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
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
                    to={`/app/resources?department=${dept.id}`}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors nav-item-inactive"
                  >
                    <span className="truncate">{dept.name}</span>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        color: 'var(--text-muted)',
                        backgroundColor: 'var(--bg-secondary)',
                      }}
                    >
                      {dept.code}
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Main Application Outlet */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

      </div>

      {/* In-App Modals */}
      <PDFViewerModal />
      <AIStudyModal />
      <UploadResourceModal />

      {/* Application Footer */}
      <footer
        className="py-4 mt-auto border-t"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          AcademicHub Operating Workspace • Logged in as{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {user?.name || 'User'} ({user?.role || 'Member'})
          </strong>
        </div>
      </footer>

    </div>
  );
}
