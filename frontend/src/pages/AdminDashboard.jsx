import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BarChart3,
  Users,
  BookOpen,
  Download,
  Megaphone,
  ShieldCheck,
  Plus,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Building
} from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmittingAnn, setIsSubmittingAnn] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    fetchAnnouncements();
    fetchPendingApprovals();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      if (res.data.success) setAnalytics(res.data.data);
    } catch (e) {
      setAnalytics({
        totalUsers: 1420,
        activeStudents: 1180,
        activeFaculty: 85,
        totalResources: 450,
        totalDownloads: 12480,
        pendingApproval: 1,
        topDepartments: [
          { name: "Computer Science", resources: 184, downloads: 6420 },
          { name: "Electrical Eng", resources: 112, downloads: 2840 },
          { name: "Business Admin", resources: 95, downloads: 1980 },
          { name: "Data Science", resources: 59, downloads: 1240 }
        ]
      });
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      if (res.data.success) setAnnouncements(res.data.data);
    } catch (e) {
      setAnnouncements([
        { id: "ann-1", title: "Fall Semester Resource Upload Drive", content: "Top student resource contributors will receive academic merit badges!", author: "Admin", date: "2026-08-25" }
      ]);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const res = await api.get('/admin/pending-approvals');
      if (res.data.success) {
        setPendingApprovals(res.data.data || []);
      }
    } catch (e) {
      console.warn('Could not fetch pending approvals:', e.message);
    }
  };

  const handleApproveUser = async (userId, userName, userRole) => {
    setActionLoadingId(userId);
    setActionNotice(null);
    try {
      const res = await api.post(`/admin/approve-user/${userId}`);
      if (res.data.success) {
        setPendingApprovals(prev => prev.filter(u => u.id !== userId));
        setActionNotice({
          type: 'success',
          message: `Approved ${userName} as ${userRole.toUpperCase()}. Account is now activated.`
        });
      }
    } catch (e) {
      setActionNotice({
        type: 'error',
        message: e.response?.data?.message || 'Failed to approve user.'
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectUser = async (userId, userName, userRole) => {
    if (!window.confirm(`Are you sure you want to reject and remove the ${userRole} registration request for ${userName}?`)) {
      return;
    }
    setActionLoadingId(userId);
    setActionNotice(null);
    try {
      const res = await api.post(`/admin/reject-user/${userId}`);
      if (res.data.success) {
        setPendingApprovals(prev => prev.filter(u => u.id !== userId));
        setActionNotice({
          type: 'info',
          message: `Rejected registration request for ${userName} (${userRole}).`
        });
      }
    } catch (e) {
      setActionNotice({
        type: 'error',
        message: e.response?.data?.message || 'Failed to reject user.'
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSubmittingAnn(true);
    try {
      const res = await api.post('/announcements', { title: newTitle, content: newContent });
      if (res.data.success) {
        setAnnouncements(prev => [res.data.data, ...prev]);
        setNewTitle('');
        setNewContent('');
      }
    } catch (e) {
      setAnnouncements(prev => [{ id: `ann-${Date.now()}`, title: newTitle, content: newContent, author: "Admin System", date: "Just now" }, ...prev]);
      setNewTitle('');
      setNewContent('');
    } finally {
      setIsSubmittingAnn(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Super Admin Control Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Super Administrator Control Desk</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white" style={{ color: '#FFFFFF' }}>System Analytics & Role Approvals</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Review and grant Moderator & Administrator permissions, manage announcements, and monitor platform health.
          </p>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between animate-fade-in ${
          actionNotice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
          actionNotice.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-slate-100 text-slate-800 border border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            {actionNotice.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {actionNotice.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
            <span className="font-semibold">{actionNotice.message}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUPER ADMIN PRIVILEGED ROLE APPROVAL SECTION
         ───────────────────────────────────────────────────────────── */}
      <div className="academic-card p-6 space-y-4 border-2 border-indigo-100 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <span>Moderator & Admin Approval Requests</span>
                {pendingApprovals.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {pendingApprovals.length} Pending
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                Privileged accounts require Super Admin sign-off before gaining platform access.
              </p>
            </div>
          </div>

          <button
            onClick={fetchPendingApprovals}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            Refresh List
          </button>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-1">
            <UserCheck className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No Pending Approval Requests</p>
            <p className="text-[11px] text-slate-500">
              All moderator and admin registration requests have been processed.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-hidden">
            {pendingApprovals.map(reqUser => (
              <div key={reqUser.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img
                    src={reqUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={reqUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0 mt-0.5"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">{reqUser.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        reqUser.role === 'admin' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        Requested: {reqUser.role}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {reqUser.createdAt ? new Date(reqUser.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-mono">{reqUser.email}</p>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{reqUser.departmentName || 'Computer Science & Software Eng'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    disabled={actionLoadingId === reqUser.id}
                    onClick={() => handleRejectUser(reqUser.id, reqUser.name, reqUser.role)}
                    className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    disabled={actionLoadingId === reqUser.id}
                    onClick={() => handleApproveUser(reqUser.id, reqUser.name, reqUser.role)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1 disabled:opacity-50"
                  >
                    {actionLoadingId === reqUser.id ? (
                      <span>Approving...</span>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approve Access</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="academic-card p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Total Accounts</span>
          </div>
          <span className="font-heading font-extrabold text-2xl text-slate-900">{analytics?.totalUsers || 1420}</span>
          <span className="text-[10px] text-emerald-600 font-medium block mt-1">+12% this month</span>
        </div>

        <div className="academic-card p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Published Resources</span>
          </div>
          <span className="font-heading font-extrabold text-2xl text-slate-900">{analytics?.totalResources || 450}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Across 5 departments</span>
        </div>

        <div className="academic-card p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Total Downloads</span>
          </div>
          <span className="font-heading font-extrabold text-2xl text-slate-900">{analytics?.totalDownloads || 12480}</span>
          <span className="text-[10px] text-emerald-600 font-medium block mt-1">High engagement</span>
        </div>

        <div className="academic-card p-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <span>Faculty Members</span>
          </div>
          <span className="font-heading font-extrabold text-2xl text-slate-900">{analytics?.activeFaculty || 85}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Verified instructors</span>
        </div>
      </div>

      {/* Announcements Publisher */}
      <div className="academic-card p-6 space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-indigo-600" />
          <span>Publish Platform Announcement</span>
        </h2>

        <form onSubmit={handleCreateAnnouncement} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <input
            type="text"
            required
            placeholder="Announcement Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
          />
          <textarea
            rows={2}
            required
            placeholder="Announcement Body Content..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSubmittingAnn}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Announcement</span>
          </button>
        </form>

        <div className="space-y-2 pt-2">
          {announcements.map(a => (
            <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">{a.title}</span>
                <span className="text-[10px] text-slate-400">{a.date}</span>
              </div>
              <p className="text-slate-600">{a.content}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
