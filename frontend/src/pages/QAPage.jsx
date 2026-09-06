import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import api from '../services/api';
import { HelpCircle, ThumbsUp, Plus, CheckCircle2, Search, X } from 'lucide-react';

export default function QAPage() {
  const { user } = useAuth();
  const { trackQuestion, trackAnswer } = useActivity();
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, [searchQ]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/questions', { params: { search: searchQ } });
      if (res.data.success) setQuestions(res.data.data);
    } catch (e) {
      setQuestions([
        {
          id: "q-1",
          title: "How to handle AVL Tree double rotation when inserting node into right-left sub-tree?",
          content: "I'm working on Assignment 2 for CS201. Can someone explain why an RL rotation requires a right rotate on the child followed by a left rotate on the parent?",
          authorName: "Marcus Vance",
          authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          votes: 14,
          answersCount: 1,
          isSolved: true,
          tags: ["Algorithms", "Trees"],
          createdAt: "2026-08-28",
          answers: [
            {
              id: "ans-1",
              authorName: "Dr. Robert Chen",
              authorRole: "teacher",
              authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
              content: "An RL imbalance occurs when a node is inserted into the left subtree of the right child. Rotating the child first converts it to an RR case, allowing a single left rotation to balance the root.",
              votes: 18,
              isAccepted: true
            }
          ]
        }
      ]);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.post('/questions', {
        title: newTitle,
        content: newContent,
        tags: newTags,
        authorName: user?.name || 'Anonymous Scholar',
        authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
      if (res.data.success) {
        setQuestions(prev => [res.data.data, ...prev]);
        trackQuestion();
        setIsModalOpen(false);
        setNewTitle('');
        setNewContent('');
      }
    } catch (e) {
      setQuestions(prev => [
        {
          id: `q-${Date.now()}`,
          title: newTitle,
          content: newContent,
          authorName: user?.name || 'Anonymous Scholar',
          authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          votes: 1,
          answersCount: 0,
          isSolved: false,
          tags: ["General"],
          createdAt: "Just now",
          answers: []
        },
        ...prev
      ]);
      trackQuestion();
      setIsModalOpen(false);
      setNewTitle('');
      setNewContent('');
    }
  };

  const handleVote = async (id) => {
    try {
      await api.post(`/questions/${id}/vote`, { delta: 1 });
    } catch (e) {
      // Local vote toggle
    }
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, votes: q.votes + 1 } : q));
  };

  const handleAddAnswer = async (qId) => {
    const text = replyText[qId];
    if (!text || !text.trim()) return;

    try {
      await api.post(`/questions/${qId}/answers`, {
        content: text,
        authorName: user?.name || 'AcademicHub User',
        authorRole: user?.role || 'student',
        authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
    } catch (e) {
      // local append
    }
    trackAnswer();

    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        const newAns = {
          id: `ans-${Date.now()}`,
          authorName: user?.name || 'AcademicHub User',
          authorRole: user?.role || 'student',
          authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          content: text,
          votes: 1,
          isAccepted: false
        };
        return {
          ...q,
          answersCount: q.answersCount + 1,
          answers: [...(q.answers || []), newAns]
        };
      }
      return q;
    }));

    setReplyText(prev => ({ ...prev, [qId]: '' }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Bar */}
      <div className="academic-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>Academic Q&A Forum</span>
          </h1>
          <p className="text-xs text-slate-500">Ask coursework questions, clarify concepts, and get answers from faculty & peers</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Q&A..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ask Question</span>
          </button>
        </div>
      </div>

      {/* Questions Feed */}
      <div className="space-y-4">
        {questions.map(q => (
          <div key={q.id} className="academic-card p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleVote(q.id)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-600 transition-colors shrink-0"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xs font-bold mt-1">{q.votes}</span>
                </button>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">{q.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{q.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {q.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {t}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400">Asked by {q.authorName} • {q.createdAt}</span>
                  </div>
                </div>
              </div>

              {q.isSolved && (
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Solved</span>
                </span>
              )}
            </div>

            {/* Answer thread */}
            {q.answers && q.answers.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {q.answers.map(ans => (
                  <div key={ans.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <span>{ans.authorName}</span>
                        {ans.authorRole === 'teacher' && (
                          <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">Faculty Answer</span>
                        )}
                      </div>
                      {ans.isAccepted && <span className="text-[10px] font-bold text-emerald-600">✓ Accepted Answer</span>}
                    </div>
                    <p className="text-slate-600">{ans.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Answer Reply Box */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Write your answer..."
                value={replyText[q.id] || ''}
                onChange={(e) => setReplyText({ ...replyText, [q.id]: e.target.value })}
                className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
              <button
                onClick={() => handleAddAnswer(q.id)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shrink-0"
              >
                Post Answer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-heading font-bold text-base text-slate-900">Ask Course Question</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to balance AVL tree on right-left insert?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Details / Code Context</label>
                <textarea
                  rows={3}
                  placeholder="Provide context or paste problem snippet..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Post Question</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
