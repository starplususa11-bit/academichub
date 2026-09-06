import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, BookOpen, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function RoleSwitcher() {
  const { user, switchRole } = useAuth();

  const roles = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'teacher', label: 'Teacher', icon: BookOpen },
    { id: 'moderator', label: 'Moderator', icon: ShieldAlert },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-xs font-medium">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Role:</span>
      {roles.map(r => {
        const Icon = r.icon;
        const isActive = user.role === r.id;
        return (
          <button
            key={r.id}
            onClick={() => switchRole(r.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? 'bg-white text-indigo-600 font-semibold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
            title={`Switch to ${r.label} View`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}
