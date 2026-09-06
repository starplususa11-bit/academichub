import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResourceProvider } from './context/ResourceContext';
import { ActivityProvider } from './context/ActivityContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';

// Route Guards & Modals
import ProtectedRoute from './components/ProtectedRoute';
import AuthModal from './components/AuthModal';

// Public & Auth Pages (eager loaded for fast first paint)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StudentDashboard from './pages/StudentDashboard';

// Lazy-loaded Private & Utility Pages (code-splitting for performance)
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const ModeratorDashboard = lazy(() => import('./pages/ModeratorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const QAPage = lazy(() => import('./pages/QAPage'));
const StudyGroupsPage = lazy(() => import('./pages/StudyGroupsPage'));
const AIStudyPage = lazy(() => import('./pages/AIStudyPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Sleek fallback loader while chunk is streaming
function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        <span className="text-xs font-medium text-slate-400">Loading view...</span>
      </div>
    </div>
  );
}

// Smart Landing Page Route
function RootRoute() {
  return <LandingPage />;
}

// Prevent authenticated users from accessing login/signup/forgot-password pages
function PublicOnlyRoute({ children }) {
  const { token, user, loading } = useAuth();
  
  if (loading) return null;

  if (token && user) {
    const roleTarget = user.role === 'teacher' ? '/app/teacher-dashboard' :
                       user.role === 'moderator' ? '/app/moderator-dashboard' :
                       user.role === 'admin' ? '/app/admin-dashboard' : '/app/dashboard';
    return <Navigate to={roleTarget} replace />;
  }

  return children;
}

// Role-based main dashboard resolver
function DashboardRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'teacher') return <TeacherDashboard />;
  if (user.role === 'moderator') return <ModeratorDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  return <StudentDashboard />;
}

// Bridge component to provide user into ActivityProvider from inside AuthProvider
function AppWithActivity() {
  const { user } = useAuth();
  return (
    <ActivityProvider user={user}>
      <ResourceProvider>
        <Router>
          <Suspense fallback={<PageFallback />}>
            <Routes>

              {/* ── PUBLIC MARKETING ROUTE (with marketing header & footer) ── */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<RootRoute />} />
              </Route>

              {/* ── STANDALONE AUTHENTICATION ROUTES (Dedicated AuthLayout, NO Navbar) ── */}
              <Route element={<AuthLayout />}>
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <LoginPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicOnlyRoute>
                      <SignupPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PublicOnlyRoute>
                      <ForgotPasswordPage />
                    </PublicOnlyRoute>
                  }
                />
              </Route>

              {/* ── PROTECTED PRIVATE APPLICATION ROUTES (Full App Shell & Guard) ── */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardRoute />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="qa" element={<QAPage />} />
                <Route path="groups" element={<StudyGroupsPage />} />
                <Route path="ai-study" element={<AIStudyPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />

                {/* Role-specific dashboards */}
                <Route
                  path="teacher-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="moderator-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['moderator', 'admin']}>
                      <ModeratorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Legacy direct routes: safely redirect into protected /app routes */}
              <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/student-dashboard" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/teacher-dashboard" element={<Navigate to="/app/teacher-dashboard" replace />} />
              <Route path="/moderator-dashboard" element={<Navigate to="/app/moderator-dashboard" replace />} />
              <Route path="/admin-dashboard" element={<Navigate to="/app/admin-dashboard" replace />} />
              <Route path="/resources" element={<Navigate to="/app/resources" replace />} />
              <Route path="/qa" element={<Navigate to="/app/qa" replace />} />
              <Route path="/groups" element={<Navigate to="/app/groups" replace />} />
              <Route path="/ai-study" element={<Navigate to="/app/ai-study" replace />} />
              <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
              <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

              {/* Dedicated 404 Page (Proper UI State) */}
              <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </Suspense>

          {/* Global Modal Layer */}
          <AuthModal />
        </Router>
      </ResourceProvider>
    </ActivityProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppWithActivity />
      </AuthProvider>
    </ThemeProvider>
  );
}

