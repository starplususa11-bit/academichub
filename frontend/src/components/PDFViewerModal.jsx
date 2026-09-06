import React, { useState } from 'react';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import api from '../services/api';
import {
  X,
  Download,
  Star,
  FileText,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles
} from 'lucide-react';

export default function PDFViewerModal() {
  const { activePdfResource, setActivePdfResource, setActiveAiResource, toggleBookmark, bookmarks } = useResources();
  const { user } = useAuth();
  const { trackDownload, trackAiSession } = useActivity();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!activePdfResource) return null;

  const isBookmarked = bookmarks.includes(activePdfResource.id);

  const handleDownload = async () => {
    trackDownload();
    try {
      await api.post(`/resources/${activePdfResource.id}/download`);
    } catch (e) {
      console.warn("Download counted locally");
    }
    window.open(activePdfResource.fileUrl || '#', '_blank');
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      await api.post(`/resources/${activePdfResource.id}/reviews`, {
        rating: newRating,
        comment: newComment,
        userName: user.name
      });
      activePdfResource.reviews = activePdfResource.reviews || [];
      activePdfResource.reviews.unshift({
        id: `rev-${Date.now()}`,
        userName: user.name,
        userAvatar: user.avatar,
        rating: newRating,
        comment: newComment,
        date: "Just now"
      });
      setNewComment('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        
        {/* Modal Header Toolbar */}
        <div
          className="px-6 py-3.5 border-b flex items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                {activePdfResource.title}
              </h2>
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-muted)' }}>
                {activePdfResource.courseName} • Uploaded by {activePdfResource.uploaderName}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const res = activePdfResource;
                trackAiSession();
                setActivePdfResource(null);
                setActiveAiResource(res);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 text-xs font-semibold border border-indigo-500/30 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>AI PDF Summarizer</span>
            </button>

            <button
              onClick={() => toggleBookmark(activePdfResource.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isBookmarked ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'hover:border-indigo-400'
              }`}
              style={
                !isBookmarked
                  ? {
                      backgroundColor: 'var(--surface-input)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }
                  : {}
              }
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ({activePdfResource.fileSize || '3.2 MB'})</span>
            </button>

            <button
              onClick={() => setActivePdfResource(null)}
              className="p-1.5 rounded-xl transition-colors cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Reader Canvas */}
          <div
            className="flex-1 p-6 flex flex-col items-center justify-between overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-main)' }}
          >
            
            {/* Zoom Controls */}
            <div
              className="backdrop-blur border rounded-xl px-4 py-2 shadow-xs flex items-center gap-4 text-xs font-semibold sticky top-0 z-10"
              style={{
                backgroundColor: 'var(--surface-overlay)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
            >
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-1 hover:bg-slate-100 rounded">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>Page {currentPage} of 12</span>
                <button onClick={() => setCurrentPage(p => Math.min(12, p + 1))} className="p-1 hover:bg-slate-100 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <button onClick={() => setZoomLevel(z => Math.max(75, z - 15))} className="p-1 hover:bg-slate-100 rounded">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span>{zoomLevel}%</span>
                <button onClick={() => setZoomLevel(z => Math.min(150, z + 15))} className="p-1 hover:bg-slate-100 rounded">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Render Sheet */}
            <div
              className="rounded-xl shadow-lg border p-8 w-full max-w-2xl min-h-[480px] my-4 transition-all duration-200 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center'
              }}
            >
              <div>
                <div
                  className="flex items-center justify-between border-b pb-4 mb-6"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AcademicHub Verified Reader</span>
                    <h3 className="font-heading font-bold text-lg mt-0.5" style={{ color: 'var(--text-primary)' }}>
                      {activePdfResource.title}
                    </h3>
                  </div>
                  <span
                    className="px-2.5 py-1 text-xs font-semibold rounded-md border"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {activePdfResource.category}
                  </span>
                </div>

                <div
                  className="space-y-4 text-xs leading-relaxed p-5 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <p className="font-semibold font-sans text-sm" style={{ color: 'var(--text-primary)' }}>
                    Chapter 3: Core Principles & Theoretical Analysis
                  </p>
                  <p>
                    Binary Search Trees (BST) maintain key invariants where every left child key is strictly smaller than the parent node, and right child key is strictly larger.
                  </p>
                  <pre
                    className="p-3 rounded-lg text-[11px] font-mono overflow-x-auto border"
                    style={{
                      backgroundColor: 'var(--surface-input)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  >
{`struct Node {
    int key;
    Node *left, *right;
    int height; // Balance factor tracker
};`}
                  </pre>
                  <p>
                    When dynamic insertion degrades tree balance factor beyond bounds, rotation algorithms restore O(log N) operations.
                  </p>
                </div>
              </div>

              <div
                className="pt-4 border-t flex items-center justify-between text-[11px]"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                <span>Page {currentPage} — AcademicHub Ecosystem</span>
                <span>{activePdfResource.courseName}</span>
              </div>
            </div>

          </div>

          {/* Right Reviews Sidebar */}
          <div
            className="w-80 border-l p-5 flex flex-col justify-between overflow-y-auto"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <div>
              <h3
                className="font-heading font-bold text-xs mb-3 flex items-center gap-1.5"
                style={{ color: 'var(--text-primary)' }}
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Ratings & Student Reviews</span>
              </h3>

              {/* Review Form */}
              <form
                onSubmit={handleAddReview}
                className="mb-4 p-3 rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Rating:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-0.5 text-amber-400 cursor-pointer"
                    >
                      <Star className={`w-3.5 h-3.5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-500'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  placeholder="Write feedback..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2"
                  style={{
                    backgroundColor: 'var(--surface-input)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                />
                <button
                  type="submit"
                  disabled={isSubmittingReview || !newComment.trim()}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Submit Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-2.5">
                {activePdfResource.reviews && activePdfResource.reviews.length > 0 ? (
                  activePdfResource.reviews.map(rev => (
                    <div
                      key={rev.id}
                      className="p-2.5 rounded-xl border text-xs"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-subtle)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{rev.userName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span className="font-bold text-[10px]">{rev.rating}</span>
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)' }} className="text-[11px] leading-snug">{rev.comment}</p>
                      <span className="text-[9px] mt-1 block" style={{ color: 'var(--text-muted)' }}>{rev.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
