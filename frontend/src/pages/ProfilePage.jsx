import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import { User, Mail, Shield, Building, BookOpen, Award, Download, Users, MessageSquare, Sparkles, Bookmark } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { stats } = useActivity();

  if (!user) return null;

  const roleColor = {
    student:   'bg-blue-50 text-blue-700 border border-blue-200',
    teacher:   'bg-indigo-50 text-indigo-700 border border-indigo-200',
    moderator: 'bg-amber-50 text-amber-700 border border-amber-200',
    admin:     'bg-red-50 text-red-700 border border-red-200',
  };

  // Activity stats — all sourced from live ActivityContext (start at 0 for new users)
  const activityStats = [
    {
      label: 'Resources Saved',
      value: stats.bookmarksSaved,
      icon: Bookmark,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Questions Asked',
      value: stats.questionsAsked,
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'AI Sessions',
      value: stats.aiSessions,
      icon: Sparkles,
      color: 'text-violet-600 bg-violet-50',
    },
    {
      label: 'Groups Joined',
      value: stats.groupsJoined,
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Downloads',
      value: stats.downloadsCount,
      icon: Download,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Answers Given',
      value: stats.answersGiven,
      icon: Award,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="academic-card p-6">
        <h1 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          My Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Your academic account details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar & Name Card */}
        <div className="academic-card p-6 flex flex-col items-center text-center space-y-3">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-sm"
          />
          <div>
            <h2 className="font-heading font-bold text-base text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${roleColor[user.role] || roleColor.student}`}>
            {user.role}
          </span>
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2 academic-card p-6 space-y-4">
          <h3 className="font-heading font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Account Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Full Name</label>
              <div
                className="flex items-center gap-2 p-2.5 rounded-xl border text-xs"
                style={{
                  backgroundColor: 'var(--surface-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>{user.name}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Email</label>
              <div
                className="flex items-center gap-2 p-2.5 rounded-xl border text-xs"
                style={{
                  backgroundColor: 'var(--surface-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Role</label>
              <div
                className="flex items-center gap-2 p-2.5 rounded-xl border text-xs"
                style={{
                  backgroundColor: 'var(--surface-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Department</label>
              <div
                className="flex items-center gap-2 p-2.5 rounded-xl border text-xs"
                style={{
                  backgroundColor: 'var(--surface-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                <Building className="w-4 h-4 text-slate-400" />
                <span>{user.departmentName || 'Not assigned'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Activity Summary — live from ActivityContext */}
      <div className="academic-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Award className="w-4 h-4 text-indigo-400" />
            Academic Activity
          </h3>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Updates in real-time as you use AcademicHub</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {activityStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-4 rounded-xl border text-center space-y-2 transition-all hover:border-indigo-400"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mx-auto`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-xl" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                <div className="text-[10px] font-medium leading-tight" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Empty state for brand-new users */}
        {Object.values(stats).every((v) => v === 0) && (
          <p className="text-center text-xs text-slate-400 pt-2">
            🎓 Your stats will grow as you bookmark resources, join groups, ask questions, and use AI tools.
          </p>
        )}
      </div>
    </div>
  );
}
