import React, { useState, useRef } from 'react';
import api from '../services/api';
import { useActivity } from '../context/ActivityContext';
import {
  Sparkles,
  MessageSquare,
  Lightbulb,
  FileText,
  HelpCircle,
  CreditCard,
  Send,
  Copy,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Loader2,
  BookOpen,
  UploadCloud,
  FileUp,
  File,
  X,
  Trash2,
  Paperclip,
  Check,
  NotebookPen
} from 'lucide-react';

// ─── Markdown renderer (bold/italic/lists) ────────────────────────────────────
function RichText({ text }) {
  if (!text) return null;
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
  return (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  );
}

// ─── Copy-to-clipboard button ─────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-indigo-600 transition-colors"
    >
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ─── Loading indicator ────────────────────────────────────────────────────────
function AIThinking() {
  return (
    <div className="flex items-center gap-2 text-xs text-indigo-500 py-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="font-medium">AI is thinking…</span>
      <span className="flex gap-1">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </span>
    </div>
  );
}

// ─── Error message ────────────────────────────────────────────────────────────
function AIError({ onRetry }) {
  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
      <div>
        <strong>AI Study is temporarily unavailable.</strong>
        <p className="mt-1 text-amber-700">Please try again in a moment.</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-900"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Mode definitions ─────────────────────────────────────────────────────────
const MODES = [
  { id: 'ask',        label: 'Ask AI',          icon: MessageSquare, color: 'indigo' },
  { id: 'explain',    label: 'Explain',         icon: Lightbulb,     color: 'amber'  },
  { id: 'notes',      label: 'Study Notes',     icon: NotebookPen,   color: 'teal'   },
  { id: 'summarize',  label: 'Summarize Doc',   icon: FileUp,        color: 'blue'   },
  { id: 'quiz',       label: 'Quiz Me',         icon: HelpCircle,    color: 'violet' },
  { id: 'flashcard',  label: 'Flashcards',      icon: CreditCard,    color: 'emerald'},
];

const colorMap = {
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200',  active: 'bg-indigo-600 text-white' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   active: 'bg-amber-600 text-white' },
  teal:    { bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200',    active: 'bg-teal-600 text-white' },
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    active: 'bg-blue-600 text-white' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  active: 'bg-violet-600 text-white' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', active: 'bg-emerald-600 text-white' },
};

// ─── ASK AI MODE ─────────────────────────────────────────────────────────────
function AskMode({ context }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    setError(false);

    try {
      const res = await api.post('/ai/ask', { question, context: context || 'Computer Science' });
      const answer = res.data.answer || 'No response received.';
      setMessages(prev => [...prev, { role: 'ai', text: answer }]);
    } catch {
      setError(true);
      setMessages(prev => prev.slice(0, -1));
      setInput(question);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => { setError(false); send(); };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500 font-medium">Ask any academic question</p>
            <p className="text-xs text-slate-400">e.g. "Explain dynamic programming with an example"</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] p-3.5 rounded-xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-sm'
              }`}
            >
              {m.role === 'ai' ? (
                <>
                  <RichText text={m.text} />
                  <div className="mt-2 flex justify-end">
                    <CopyButton text={m.text} />
                  </div>
                </>
              ) : m.text}
            </div>
          </div>
        ))}
        {loading && <AIThinking />}
        {error && <AIError onRetry={retry} />}
      </div>

      <div className="border-t border-slate-200 pt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          disabled={loading}
          placeholder="Ask anything about your study material…"
          className="flex-1 text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}

// ─── EXPLAIN MODE ─────────────────────────────────────────────────────────────
function ExplainMode({ context }) {
  const [concept, setConcept] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const run = async () => {
    if (!concept.trim() || loading) return;
    setLoading(true); setError(false); setResult(null);
    try {
      const res = await api.post('/ai/explain', { concept: concept.trim(), context: context || 'Computer Science' });
      setResult(res.data.explanation);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Enter Concept to Explain</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={concept}
            onChange={e => setConcept(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="e.g. AVL Tree balance factor"
            className="flex-1 text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          <button
            onClick={run}
            disabled={loading || !concept.trim()}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-40 transition-all"
          >
            <Lightbulb className="w-3.5 h-3.5" /> Explain
          </button>
        </div>
      </div>

      {loading && <AIThinking />}
      {error && <AIError onRetry={run} />}
      {result && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-slate-800 leading-relaxed space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-700 font-bold flex items-center gap-1"><Lightbulb className="w-4 h-4" /> AI Explanation</span>
            <CopyButton text={result} />
          </div>
          <RichText text={result} />
        </div>
      )}
    </div>
  );
}

// ─── SUMMARIZE MODE (Upload Document / Paste Notes / Topic) ───────────────────
function SummarizeMode({ context }) {
  const [subTab, setSubTab] = useState('upload'); // 'upload' | 'paste' | 'topic'
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      if (!title) {
        setTitle(dropped.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const run = async () => {
    if (loading) return;
    if (subTab === 'upload' && !file && !title.trim()) return;
    if (subTab === 'paste' && !documentText.trim()) return;
    if (subTab === 'topic' && !title.trim()) return;

    setLoading(true);
    setError(false);
    setResult(null);

    try {
      let res;
      if (subTab === 'upload' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title.trim() || file.name);
        formData.append('courseName', context || 'Computer Science');
        res = await api.post('/ai/summarize', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (subTab === 'paste') {
        res = await api.post('/ai/summarize', {
          documentText: documentText.trim(),
          title: title.trim() || 'Pasted Notes',
          courseName: context || 'Computer Science'
        });
      } else {
        res = await api.post('/ai/summarize', {
          title: title.trim(),
          courseName: context || 'Computer Science'
        });
      }

      if (res.data.success && res.data.data) {
        setResult(res.data.data);
      } else {
        throw new Error('Summary failed');
      }
    } catch (err) {
      console.error('Summarize error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setResult(null);
    setFile(null);
    setTitle('');
    setDocumentText('');
    setError(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFileBadge = (filename) => {
    const ext = filename ? filename.split('.').pop().toUpperCase() : 'DOC';
    if (ext === 'PDF') return { label: 'PDF', bg: 'bg-red-50 text-red-700 border-red-200' };
    if (['TXT', 'MD'].includes(ext)) return { label: ext, bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    return { label: ext, bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  };

  return (
    <div className="space-y-4">
      {/* Sub-tab selection */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit text-xs font-semibold">
        <button
          onClick={() => { setSubTab('upload'); setError(false); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            subTab === 'upload'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>

        <button
          onClick={() => { setSubTab('paste'); setError(false); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            subTab === 'paste'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Paste Notes</span>
        </button>

        <button
          onClick={() => { setSubTab('topic'); setError(false); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            subTab === 'topic'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Topic / Title</span>
        </button>
      </div>

      {/* Mode 1: Upload Document File */}
      {subTab === 'upload' && (
        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.txt,.md,.doc,.docx,.csv"
            className="hidden"
          />

          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                  : 'border-slate-300 bg-slate-50 hover:bg-blue-50/40 hover:border-blue-400'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                <UploadCloud className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to browse or drag & drop your study document
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports PDF, TXT, Markdown, Word (.docx), or CSV (up to 25MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white border border-blue-200 rounded-2xl shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {file.name}
                    </p>
                    {(() => {
                      const badge = getFileBadge(file.name);
                      return (
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border uppercase ${badge.bg}`}>
                          {badge.label}
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {formatFileSize(file.size)} • Ready for Gemini synthesis
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Optional Title input for uploaded file */}
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Document Title / Subject (optional)"
              className="flex-1 text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              onClick={run}
              disabled={loading || !file}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-40 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Summarize Document
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Paste Raw Notes / Text */}
      {subTab === 'paste' && (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Document or Chapter Title (e.g. Chapter 4: Concurrency & Semaphores)"
            className="w-full text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />

          <div className="relative">
            <textarea
              rows={6}
              value={documentText}
              onChange={e => setDocumentText(e.target.value)}
              placeholder="Paste your lecture notes, book excerpt, slides transcription, or study summary here..."
              className="w-full text-xs p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono leading-relaxed"
            />
            <span className="absolute right-3 bottom-3 text-[10px] text-slate-400 font-mono">
              {documentText.length} characters
            </span>
          </div>

          <div className="flex justify-end">
            <button
              onClick={run}
              disabled={loading || !documentText.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-40 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Summarize Notes
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Topic / Title quick summary */}
      {subTab === 'topic' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              placeholder="e.g. Operating Systems — Memory Management & Paging"
              className="flex-1 text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              onClick={run}
              disabled={loading || !title.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-40 transition-all shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Summarize Topic
            </button>
          </div>
        </div>
      )}

      {/* Loading & Error States */}
      {loading && (
        <div className="p-6 bg-blue-50/50 border border-blue-200 rounded-2xl text-center space-y-2 animate-fade-in">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-800">
            Analyzing document content with Google Gemini AI...
          </p>
          <p className="text-[11px] text-slate-500">
            Synthesizing key points, theoretical invariants, and active recall study outline
          </p>
        </div>
      )}

      {error && <AIError onRetry={run} />}

      {/* Summary Output */}
      {result && (
        <div className="space-y-4 animate-fade-in pt-2">
          {/* Header Banner */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900 text-white rounded-2xl shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{result.docTitle || title || 'Document Summary'}</p>
                <p className="text-[10px] text-slate-400">AI Synthesized Academic Breakdown</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <CopyButton text={`${result.executiveSummary}\n\nKey Points:\n${result.keyPoints?.map(p => `• ${p}`).join('\n')}`} />
              <button
                onClick={resetAll}
                className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Summarize Another
              </button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs leading-relaxed">
            <p className="font-bold text-blue-800 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" /> Executive Overview
            </p>
            <p className="text-slate-800 font-normal leading-relaxed">{result.executiveSummary}</p>
          </div>

          {/* Key Study Points */}
          <div className="academic-card p-5 space-y-3">
            <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Key Theoretical & Practical Points
            </p>
            <ul className="space-y-2">
              {result.keyPoints?.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Concepts */}
          {result.coreConcepts && result.coreConcepts.length > 0 && (
            <div className="academic-card p-5 space-y-3">
              <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Core Concepts & Terminology
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.coreConcepts.map((item, i) => (
                  <div key={i} className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-1">
                    <p className="font-bold text-xs text-amber-900">{item.concept}</p>
                    <p className="text-[11px] text-slate-700 leading-snug">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Study Outline */}
          {result.studyOutline && result.studyOutline.length > 0 && (
            <div className="academic-card p-5 space-y-3">
              <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Structured Study & Revision Plan
              </p>
              <div className="space-y-2">
                {result.studyOutline?.map((sec, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-800 font-medium">{sec.section}</span>
                    <span className="text-blue-700 font-semibold bg-blue-100 px-2.5 py-0.5 rounded-full text-[11px]">
                      {sec.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── NOTES MODE ──────────────────────────────────────────────────────────────
function NotesMode({ context }) {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const run = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true); setError(false); setResult(null);
    try {
      const res = await api.post('/ai/notes', { topic: topic.trim(), courseName: context || 'Computer Science' });
      setResult(res.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Topic for Study Notes</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="e.g. Binary Trees, SQL Joins, Recursion"
            className="flex-1 text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
          <button
            onClick={run}
            disabled={loading || !topic.trim()}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-40 transition-all"
          >
            <NotebookPen className="w-3.5 h-3.5" /> Generate Notes
          </button>
        </div>
      </div>

      {loading && <AIThinking />}
      {error && <AIError onRetry={run} />}

      {result && (
        <div className="space-y-4">
          {/* Quick Summary */}
          {result.quickSummary && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
              <p className="font-bold text-teal-900 text-xs mb-1 flex items-center gap-1.5">
                <NotebookPen className="w-4 h-4" /> Quick Summary
              </p>
              <p className="text-xs text-teal-800 leading-relaxed">{result.quickSummary}</p>
            </div>
          )}

          {/* Cheat Sheet */}
          {Array.isArray(result.cheatSheet) && result.cheatSheet.length > 0 && (
            <div className="academic-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-600" /> Concept Cheat Sheet
                </p>
                <CopyButton text={result.cheatSheet.map(c => `${c.concept}: ${c.detail}`).join('\n')} />
              </div>
              <div className="space-y-2">
                {result.cheatSheet.map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="font-bold text-xs text-slate-900">{item.concept}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulas & Rules */}
          {Array.isArray(result.formulasAndRules) && result.formulasAndRules.length > 0 && (
            <div className="academic-card p-5 space-y-3">
              <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Key Formulas & Rules
              </p>
              <ul className="space-y-2">
                {result.formulasAndRules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="font-mono leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function QuizMode({ context }) {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const run = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true); setError(false); setQuestions([]); setSelected({}); setShowResults(false);
    try {
      const res = await api.post('/ai/mcqs', { title: topic.trim(), courseName: context || 'Computer Science', count: 5 });
      setQuestions(res.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const score = Object.entries(selected).filter(([i, ans]) => questions[i]?.answer === ans).length;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Quiz Topic / Resource</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="e.g. Binary Search Trees"
            className="flex-1 text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
          <button
            onClick={run}
            disabled={loading || !topic.trim()}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-40 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Generate Quiz
          </button>
        </div>
      </div>

      {loading && <AIThinking />}
      {error && <AIError onRetry={run} />}

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, qi) => {
            const isAnswered = selected[qi] !== undefined;
            const isCorrect = selected[qi] === q.answer;
            return (
              <div key={q.id || qi} className="academic-card p-4 space-y-3">
                <p className="font-semibold text-xs text-slate-900">Q{qi + 1}. {q.question}</p>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = selected[qi] === opt;
                    const isRight = showResults && opt === q.answer;
                    const isWrong = showResults && isSelected && !isRight;
                    return (
                      <button
                        key={oi}
                        onClick={() => !showResults && setSelected(prev => ({ ...prev, [qi]: opt }))}
                        disabled={showResults}
                        className={`text-left px-3 py-2 rounded-lg text-xs border transition-all ${
                          isRight ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold' :
                          isWrong ? 'bg-red-50 border-red-400 text-red-800' :
                          isSelected ? 'bg-violet-50 border-violet-400 text-violet-800 font-semibold' :
                          'bg-slate-50 border-slate-200 text-slate-700 hover:bg-violet-50 hover:border-violet-300'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {showResults && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-800">Explanation: </span>{q.explanation}
                  </p>
                )}
              </div>
            );
          })}

          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(selected).length < questions.length}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-all"
            >
              Submit Quiz ({Object.keys(selected).length}/{questions.length} answered)
            </button>
          ) : (
            <div className={`p-4 rounded-xl text-center text-xs font-bold border ${
              score >= Math.ceil(questions.length * 0.7)
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}>
              Score: {score} / {questions.length} — {score >= Math.ceil(questions.length * 0.7) ? '🎉 Excellent! You passed.' : '📘 Keep studying!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── FLASHCARD MODE ───────────────────────────────────────────────────────────
function FlashcardMode({ context }) {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const run = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true); setError(false); setCards([]); setCurrent(0); setFlipped(false);
    try {
      const res = await api.post('/ai/flashcards', { title: topic.trim(), topic: context || 'Computer Science' });
      setCards(res.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const prev = () => { setCurrent(c => Math.max(0, c - 1)); setFlipped(false); };
  const next = () => { setCurrent(c => Math.min(cards.length - 1, c + 1)); setFlipped(false); };
  const card = cards[current];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Topic / Resource</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="e.g. AVL Trees & Hashing"
            className="flex-1 text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <button
            onClick={run}
            disabled={loading || !topic.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-40 transition-all"
          >
            <CreditCard className="w-3.5 h-3.5" /> Generate
          </button>
        </div>
      </div>

      {loading && <AIThinking />}
      {error && <AIError onRetry={run} />}

      {cards.length > 0 && card && (
        <div className="space-y-3">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Card {current + 1} of {cards.length}</span>
            <div className="flex gap-1">
              {cards.map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-emerald-500' : 'bg-slate-200'}`}
                />
              ))}
            </div>
          </div>

          {/* Flashcard */}
          <button
            onClick={() => setFlipped(f => !f)}
            className={`w-full min-h-[180px] rounded-2xl border-2 p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              flipped
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white border-slate-200 text-slate-900 hover:border-emerald-300 hover:shadow-md'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider mb-3 opacity-70">
              {flipped ? 'BACK — ANSWER' : 'FRONT — QUESTION'}
            </div>
            <p className="text-sm font-semibold leading-snug">
              {flipped ? card.back : card.front}
            </p>
            <p className="text-[10px] mt-4 opacity-60">
              {flipped ? 'Click to see question again' : 'Click to reveal answer'}
            </p>
          </button>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={prev}
              disabled={current === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={next}
              disabled={current === cards.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-30 transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN AI STUDY PAGE ───────────────────────────────────────────────────────
export default function AIStudyPage() {
  const [activeMode, setActiveMode] = useState('ask');
  const context = 'Computer Science & Data Structures';
  const { trackAiSession } = useActivity();

  const handleModeChange = (modeId) => {
    if (modeId !== activeMode) {
      trackAiSession();
    }
    setActiveMode(modeId);
  };

  const activeModeDef = MODES.find(m => m.id === activeMode);
  const c = colorMap[activeModeDef?.color || 'indigo'];

  const renderMode = () => {
    switch (activeMode) {
      case 'ask':       return <AskMode context={context} />;
      case 'explain':   return <ExplainMode context={context} />;
      case 'summarize': return <SummarizeMode context={context} />;
      case 'quiz':      return <QuizMode context={context} />;
      case 'flashcard': return <FlashcardMode context={context} />;
      default:          return null;
    }
  };

  return (
    <div className="space-y-5 animate-fade-in pb-10">

      {/* Header */}
      <div className="academic-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI Study Suite
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">5 AI-powered study modes connected to academic knowledge base</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <span className="font-medium">Context: {context}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* Mode Selector */}
        <div className="md:col-span-3 space-y-2">
          {MODES.map(mode => {
            const Icon = mode.icon;
            const mc = colorMap[mode.color];
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold border transition-all ${
                  isActive
                    ? `${mc.active} border-transparent shadow-sm`
                    : `bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900`
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Mode Workspace */}
        <div className="md:col-span-9 academic-card p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            {activeModeDef && (() => {
              const Icon = activeModeDef.icon;
              return (
                <>
                  <div className={`w-7 h-7 rounded-lg ${c.bg} ${c.text} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-heading font-bold text-sm text-slate-900">{activeModeDef.label}</span>
                </>
              );
            })()}
          </div>
          <div className={activeMode === 'ask' ? 'h-[60vh] flex flex-col' : ''}>
            {renderMode()}
          </div>
        </div>

      </div>
    </div>
  );
}
