import React, { useState, useEffect } from 'react';
import { useResources } from '../context/ResourceContext';
import api from '../services/api';
import { ShieldAlert, Check, X, FileText, AlertTriangle } from 'lucide-react';

export default function ModeratorDashboard() {
  const { approveResource, rejectResource } = useResources();
  const [pendingItems, setPendingItems] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchPending();
    fetchReports();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get('/resources?status=pending&role=moderator');
      if (res.data.success) {
        setPendingItems(res.data.data);
      }
    } catch (e) {
      setPendingItems([
        {
          id: "res-pending-1",
          title: "Operating Systems Memory Management Notes (Paging & Virtual Memory)",
          description: "Student created summaries on page replacement algorithms (LRU, FIFO, Clock) and page table translation.",
          courseName: "CS201 - Data Structures & Algorithms",
          uploaderName: "Alex Morgan",
          uploaderRole: "student",
          createdAt: "2026-08-30",
          fileSize: "3.1 MB"
        }
      ]);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      if (res.data.success) setReports(res.data.data);
    } catch (e) {
      setReports([
        {
          id: "rep-1",
          resourceTitle: "OOP & Java Design Patterns Midterm Past Paper",
          reportedBy: "Student_9021",
          reason: "Page 4 has missing answer key diagrams.",
          status: "pending"
        }
      ]);
    }
  };

  const handleApprove = (id) => {
    approveResource(id);
    setPendingItems(prev => prev.filter(item => item.id !== id));
  };

  const handleReject = (id) => {
    rejectResource(id);
    setPendingItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Moderator Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Content Quality & Moderation Desk</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white" style={{ color: '#FFFFFF' }}>Pending Approval Queue</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Review student-submitted study resources for academic integrity, completeness, and copyright compliance.
          </p>
        </div>
      </div>

      {/* Pending Items List */}
      <div className="academic-card p-6 space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-600" />
          <span>Pending Student Uploads ({pendingItems.length})</span>
        </h2>

        {pendingItems.length > 0 ? (
          <div className="space-y-3">
            {pendingItems.map(item => (
              <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Pending Review
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{item.courseName}</span>
                  </div>
                  <h3 className="font-heading font-bold text-sm text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-snug">{item.description}</p>
                  <p className="text-[10px] text-slate-400">
                    Uploaded by <strong>{item.uploaderName}</strong> ({item.uploaderRole}) • Size: {item.fileSize}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReject(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 italic">
            Queue clean! No pending student resources awaiting approval.
          </div>
        )}
      </div>

      {/* Reported Content Queue */}
      <div className="academic-card p-6 space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Reported Content Flags ({reports.length})</span>
        </h2>

        <div className="space-y-3">
          {reports.map(rep => (
            <div key={rep.id} className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between gap-4">
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-900">{rep.resourceTitle}</span>
                <p className="text-rose-900">Reason: {rep.reason}</p>
                <span className="text-[10px] text-slate-400 block">Reported by {rep.reportedBy}</span>
              </div>
              <button
                onClick={() => setReports(prev => prev.filter(r => r.id !== rep.id))}
                className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Dismiss Flag
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
