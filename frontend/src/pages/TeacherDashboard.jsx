import React from 'react';
import { Link } from 'react-router-dom';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import ResourceCard from '../components/ResourceCard';
import { Upload, ShieldCheck, Layers, Users, Plus } from 'lucide-react';

export default function TeacherDashboard() {
  const { resources, setIsUploadOpen } = useResources();
  const { user } = useAuth();

  const officialCourseResources = resources.filter(r => r.isOfficial || r.uploaderRole === 'teacher');

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Faculty Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Faculty & Instructor Desk</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white" style={{ color: '#FFFFFF' }}>Dr. Robert Chen's Course Workspace</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Publish verified lecture slides, syllabus outlines, assignments, and manage course analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/app/groups?create=true"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow-xs transition-all shrink-0 flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Create Study Group</span>
          </Link>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Official Material</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="academic-card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>2</span>
            <span className="block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Active Courses (CS201, CS301)</span>
          </div>
        </div>

        <div className="academic-card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>{officialCourseResources.length}</span>
            <span className="block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Published Official Documents</span>
          </div>
        </div>

        <div className="academic-card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>531</span>
            <span className="block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Enrolled Students Impacted</span>
          </div>
        </div>
      </div>

      {/* Official Published Materials */}
      <div>
        <h2 className="font-heading font-bold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>My Official Published Course Materials</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officialCourseResources.map(res => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      </div>

    </div>
  );
}
