import React, { useState } from 'react';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import api from '../services/api';
import { X, UploadCloud, CheckCircle2, AlertCircle, ShieldAlert, BookOpen, LogIn } from 'lucide-react';

export default function UploadResourceModal() {
  const { isUploadOpen, setIsUploadOpen, departments, courses, fetchResources } = useResources();
  const { user, canUpload, openLoginModal } = useAuth();
  const { trackUpload } = useActivity();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Lecture Notes');
  const [departmentId, setDepartmentId] = useState('dep-cs');
  const [courseId, setCourseId] = useState('cs-201');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isUploadOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!title.trim()) {
      setErrorMessage('Resource title is required.');
      return;
    }

    if (!user) {
      setErrorMessage('Please sign in to upload resources.');
      return;
    }

    if (user.role === 'student') {
      setErrorMessage('Student accounts have view-only access. Uploading is restricted to approved Moderators, Admins, and Super Admin.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('category', category);
    formData.append('departmentId', departmentId);
    formData.append('courseId', courseId);
    formData.append('tags', tags);

    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await api.post('/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        trackUpload();
        setSuccessMessage(res.data.message || 'Resource published successfully!');
        fetchResources();
        setTimeout(() => {
          setIsUploadOpen(false);
          setSuccessMessage('');
          setErrorMessage('');
          setTitle('');
          setDescription('');
          setFile(null);
        }, 1500);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to upload resource. Please check your permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Case 1: Unauthenticated user
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
        <div
          className="w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden text-center p-6 space-y-4"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base" style={{ color: 'var(--text-primary)' }}>Sign-In Required</h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Please sign in to access uploading and academic workspace management tools.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setIsUploadOpen(false);
                openLoginModal();
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Sign In Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Student user (strictly View-Only)
  if (user.role === 'student' || !canUpload) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
        <div
          className="w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden text-center p-6 space-y-4"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base" style={{ color: 'var(--text-primary)' }}>View-Only Student Account</h3>
            <span
              className="inline-block mt-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold uppercase border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
            >
              Role: Student
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Student accounts have view and download access to all verified lecture notes, past papers, and AI study tools. 
            Academic material uploading is strictly reserved for approved <strong>Moderators</strong>, <strong>Administrators</strong>, and <strong>Super Admin</strong>.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              Understood, Return to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Authorized Uploader (Moderator, Admin, Super Admin, Faculty)
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Upload Academic Material
              </h2>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold uppercase">
                {user.role === 'admin' ? (user.isSuperAdmin ? 'Super Admin' : 'Admin') : user.role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Publish verified notes, past papers, or lab manuals directly to the catalog
            </p>
          </div>
          <button
            onClick={() => setIsUploadOpen(false)}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Resource Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Data Structures Trees & Graphs Complete Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{
                backgroundColor: 'var(--surface-input)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Department & Course Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border focus:outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--surface-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Target Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border focus:outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--surface-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border focus:outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--surface-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Past Papers">Past Papers</option>
                <option value="Lab Manuals">Lab Manuals</option>
                <option value="Presentations">Presentations</option>
                <option value="Assignments & Solutions">Assignments & Solutions</option>
                <option value="Textbook & Cheatsheets">Textbook & Cheatsheets</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Algorithms, SQL, Midterm"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border focus:outline-none"
                style={{
                  backgroundColor: 'var(--surface-input)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Summary / Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of topics covered in this document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border focus:outline-none"
              style={{
                backgroundColor: 'var(--surface-input)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* File Drag Drop Zone */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Attach Document File (PDF, DOCX, PPTX, ZIP)</label>
            <div
              className="border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer relative"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-7 h-7 text-indigo-500 mx-auto mb-1" />
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {file ? file.name : "Click to select or drop document here"}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Max file size 25MB</p>
            </div>
          </div>

          {/* Footer Submit Actions */}
          <div
            className="pt-3 border-t flex items-center justify-end gap-2"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Uploading..." : "Publish to Catalog"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
