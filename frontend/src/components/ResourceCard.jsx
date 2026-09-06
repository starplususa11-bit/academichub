import React from 'react';
import { useResources } from '../context/ResourceContext';
import { useActivity } from '../context/ActivityContext';
import {
  FileText,
  Download,
  Eye,
  Star,
  Bookmark,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function ResourceCard({ resource }) {
  const { toggleBookmark, bookmarks, setActivePdfResource, setActiveAiResource, downloadResource } = useResources();
  const { trackAiSession } = useActivity();

  const isBookmarked = bookmarks.includes(resource.id);

  const getFileBadgeColor = (type) => {
    switch (type) {
      case 'PDF': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PPTX': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ZIP': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="academic-card p-5 flex flex-col justify-between group relative overflow-hidden">
      
      {/* Top Badges & Bookmark Toggle */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getFileBadgeColor(resource.type)}`}>
              {resource.type}
            </span>
            {resource.isOfficial && (
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full" title="Faculty Verified">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            )}
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-md border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)'
              }}
            >
              {resource.category}
            </span>
          </div>

          <button
            onClick={() => toggleBookmark(resource.id)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isBookmarked ? 'bg-amber-500/20 text-amber-400' : 'hover:opacity-80'
            }`}
            style={!isBookmarked ? { color: 'var(--text-muted)' } : {}}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Resource"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => setActivePdfResource(resource)}
          className="font-heading font-semibold text-sm hover:text-indigo-400 transition-colors line-clamp-2 cursor-pointer leading-snug mb-1.5"
          style={{ color: 'var(--text-primary)' }}
        >
          {resource.title}
        </h3>

        {/* Course & Department metadata */}
        <p className="text-xs font-medium mb-2.5" style={{ color: 'var(--text-muted)' }}>
          {resource.courseName} • <span>{resource.departmentName}</span>
        </p>

        {/* Description */}
        <p className="text-xs line-clamp-2 mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {resource.description}
        </p>

        {/* Tag pills */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {resource.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)'
                }}
              >
                <Tag className="w-2.5 h-2.5" style={{ color: 'var(--text-muted)' }} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div
        className="pt-3 border-t flex items-center justify-between gap-2"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{resource.rating || '4.8'}</span>
            <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>({resource.ratingsCount || 12})</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadResource(resource);
            }}
            className="flex items-center gap-1 hover:text-indigo-400 transition-colors cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            title="Download Resource"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{resource.downloadCount}</span>
          </button>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              trackAiSession();
              setActiveAiResource(resource);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 text-[11px] font-semibold transition-colors border border-indigo-500/30 cursor-pointer"
            title="Generate AI Summary & MCQs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Study</span>
          </button>

          <button
            onClick={() => setActivePdfResource(resource)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>
        </div>
      </div>

    </div>
  );
}
