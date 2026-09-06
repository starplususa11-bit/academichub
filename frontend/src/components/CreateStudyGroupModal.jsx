import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import api from '../services/api';
import {
  X,
  Users,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function CreateStudyGroupModal({ isOpen, onClose, onGroupCreated }) {
  const { user, isSuperAdmin } = useAuth();
  const { trackGroupJoin } = useActivity();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [departmentName, setDepartmentName] = useState('Computer Science');
  const [meetingTime, setMeetingTime] = useState('');
  const [location, setLocation] = useState('Online (Discord & Google Meet)');
  const [topicsInput, setTopicsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const schedulePresets = [
    'Tuesdays & Thursdays @ 6 PM',
    'Mondays & Wednesdays @ 5 PM',
    'Fridays @ 4 PM',
    'Saturdays @ 2 PM',
    'Flexible Schedule'
  ];

  const departmentOptions = [
    { id: 'dep-cs', name: 'Computer Science' },
    { id: 'dep-ee', name: 'Electrical Engineering' },
    { id: 'dep-math', name: 'Mathematics & Statistics' },
    { id: 'dep-ba', name: 'Business Administration' },
    { id: 'dep-ds', name: 'Data Science & AI' },
    { id: 'dep-phy', name: 'Physics & Applied Sciences' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter a study group title.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please provide a brief description of the study group focus.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDept = departmentOptions.find(d => d.name === departmentName);
      const res = await api.post('/groups', {
        name: name.trim(),
        description: description.trim(),
        departmentId: selectedDept?.id || 'dep-cs',
        departmentName,
        meetingTime: meetingTime.trim() || 'Flexible schedule',
        location: location.trim() || 'Online / Campus',
        topics: topicsInput
      });

      if (res.data.success) {
        setSuccessMessage(res.data.message || 'Study group created successfully!');
        if (trackGroupJoin) trackGroupJoin(true);
        if (onGroupCreated) onGroupCreated(res.data.data);

        setTimeout(() => {
          onClose();
          setName('');
          setDescription('');
          setMeetingTime('');
          setTopicsInput('');
          setSuccessMessage('');
          setErrorMessage('');
        }, 1200);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        'Failed to create study group. Please check your privileges and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = () => {
    if (isSuperAdmin) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-500 border border-rose-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          Super Administrator
        </span>
      );
    }
    if (user?.role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          Administrator
        </span>
      );
    }
    if (user?.role === 'teacher') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          Teacher / Faculty
        </span>
      );
    }
    if (user?.role === 'moderator') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-500 border border-purple-500/30">
          <ShieldAlert className="w-3.5 h-3.5" />
          Moderator
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
        <GraduationCap className="w-3.5 h-3.5" />
        Staff Member
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div
        className="w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden my-auto transition-all"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Modal Header */}
        <div
          className="p-5 sm:p-6 border-b flex items-start justify-between gap-4"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Create Collaborative Study Group
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Creating as:
                </span>
                {getRoleBadge()}
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {user?.name}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl text-xs flex items-center gap-2.5 bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl text-xs flex items-center gap-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Group Title */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Study Group Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Distributed Systems & Cloud Architecture Circle"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/40"
              style={{
                backgroundColor: 'var(--surface-input)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Department & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Academic Department
              </label>
              <select
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/40"
                style={{
                  backgroundColor: 'var(--surface-input)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              >
                {departmentOptions.map((dept) => (
                  <option key={dept.id} value={dept.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Meeting Venue / Format
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Online (Discord) or Science Hall 204"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/40"
                  style={{
                    backgroundColor: 'var(--surface-input)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Meeting Schedule */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Meeting Schedule
              </label>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Pick a preset or customize
              </span>
            </div>

            <div className="relative mb-2">
              <Clock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                placeholder="e.g. Tuesdays & Thursdays @ 6 PM"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/40"
                style={{
                  backgroundColor: 'var(--surface-input)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {schedulePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMeetingTime(preset)}
                  className="text-[10px] px-2.5 py-1 rounded-lg border transition-all hover:border-indigo-500 hover:text-indigo-400"
                  style={{
                    backgroundColor: 'var(--surface-input)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Topics / Focus Tags */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Topics / Subject Tags
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={topicsInput}
                onChange={(e) => setTopicsInput(e.target.value)}
                placeholder="e.g. Graph Theory, Dynamic Programming, SQL, System Design"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/40"
                style={{
                  backgroundColor: 'var(--surface-input)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Separate topics with commas. They will display as searchable tags on the group card.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Group Description & Learning Objectives <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe group goals, syllabus coverage, recommended prerequisites, and what students will work on..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border transition-all outline-hidden resize-none focus:ring-2 focus:ring-indigo-500/40"
              style={{
                backgroundColor: 'var(--surface-input)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Modal Footer */}
          <div
            className="pt-4 border-t flex items-center justify-end gap-3"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Group...</span>
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5" />
                  <span>Publish Study Group</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
