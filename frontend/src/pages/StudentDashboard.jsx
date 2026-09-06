import React from 'react';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import ResourceCard from '../components/ResourceCard';
import { Bookmark, Download, Folder, Sparkles, BookOpen, Clock, MessageSquare } from 'lucide-react';

export default function StudentDashboard() {
  const { resources, bookmarks, setActiveAiResource, setActivePdfResource } = useResources();
  const { user } = useAuth();
  const { stats } = useActivity();

  const savedResources = resources.filter((r) => bookmarks.includes(r.id));
  const continueStudyingResource = savedResources[0] || resources[0];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Student Welcome Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">Student Portal</span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl mt-1 text-white" style={{ color: '#FFFFFF' }}>Good day, {user?.name || 'Scholar'} 👋</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Access your saved study materials, review coursework, and monitor your academic progress.
          </p>
        </div>
      </div>

      {/* "Continue Studying" Focused Card */}
      {continueStudyingResource && (
        <div
          className="academic-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase border border-indigo-500/30">
                {savedResources.length > 0 ? 'Saved Resource' : 'Suggested'}
              </span>
              <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <Clock className="w-3 h-3" /> Recently added
              </span>
            </div>
            <h3 className="font-heading font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              {continueStudyingResource.title}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {continueStudyingResource.courseName} • {continueStudyingResource.departmentName}
            </p>
          </div>

          <button
            onClick={() => setActivePdfResource(continueStudyingResource)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Reader</span>
          </button>
        </div>
      )}

      {/* Activity Metrics Row — all live from ActivityContext */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="academic-card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Bookmark className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>{stats.bookmarksSaved}</span>
            <span className="block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Saved Bookmarks</span>
          </div>
        </div>

        <div className="academic-card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>{stats.downloadsCount}</span>
            <span className="block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Downloads</span>
          </div>
        </div>

        <div className="academic-card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>{stats.aiSessions}</span>
            <span className="block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>AI Sessions</span>
          </div>
        </div>

        <div className="academic-card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>{stats.questionsAsked}</span>
            <span className="block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Questions Asked</span>
          </div>
        </div>
      </div>

      {/* Bookmarked Resources Section */}
      <div>
        <h2 className="font-heading font-bold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Bookmark className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>My Bookmarked Study Resources</span>
          {savedResources.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
              {savedResources.length}
            </span>
          )}
        </h2>

        {savedResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        ) : (
          <div className="academic-card p-8 text-center text-xs text-slate-400">
            No bookmarks saved yet. Click the bookmark icon on any resource to pin it here.
          </div>
        )}
      </div>

    </div>
  );
}
