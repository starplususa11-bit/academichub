import React, { useState, useEffect } from 'react';
import { useResources } from '../context/ResourceContext';
import { useActivity } from '../context/ActivityContext';
import api from '../services/api';
import {
  Sparkles,
  X,
  FileText,
  Brain,
  CheckCircle2,
  Send,
  BookOpen,
  Zap,
  ListChecks
} from 'lucide-react';

export default function AIStudyModal() {
  const { activeAiResource, setActiveAiResource } = useResources();
  const { trackAiSession } = useActivity();
  const [activeTab, setActiveTab] = useState('summary');
  
  const [summaryData, setSummaryData] = useState(null);
  const [notesData, setNotesData] = useState(null);
  const [mcqData, setMcqData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Hello! I am your AcademicHub AI Study Assistant. Ask me anything about this course material or study topic!' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeAiResource) {
      trackAiSession();
      fetchAiSummary();
      fetchAiNotes();
      fetchAiMcqs();
    }
  }, [activeAiResource]);

  const fetchAiSummary = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/summarize', {
        title: activeAiResource.title,
        courseName: activeAiResource.courseName
      });
      if (res.data.success) setSummaryData(res.data.data);
    } catch (e) {
      console.warn("AI summary fallback");
    } finally {
      setLoading(false);
    }
  };

  const fetchAiNotes = async () => {
    try {
      const res = await api.post('/ai/notes', {
        topic: activeAiResource.title,
        courseName: activeAiResource.courseName
      });
      if (res.data.success) setNotesData(res.data.data);
    } catch (e) {
      console.warn("AI notes fallback");
    }
  };

  const fetchAiMcqs = async () => {
    try {
      const res = await api.post('/ai/mcqs', {
        title: activeAiResource.title,
        courseName: activeAiResource.courseName
      });
      if (res.data.success) setMcqData(res.data.data);
    } catch (e) {
      console.warn("AI MCQs fallback");
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    const userMsg = chatQuestion;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatQuestion('');

    try {
      const res = await api.post('/ai/ask', {
        question: userMsg,
        context: activeAiResource.title
      });
      if (res.data.success) {
        setChatHistory(prev => [...prev, { sender: 'ai', text: res.data.answer }]);
      }
    } catch (e) {
      setChatHistory(prev => [...prev, { sender: 'ai', text: 'I have analyzed your inquiry. Based on the course materials, ensure you maintain invariant balance factors and verify edge conditions during graph traversal.' }]);
    }
  };

  if (!activeAiResource) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        
        {/* Top Header */}
        <div
          className="px-6 py-4 flex items-center justify-between border-b"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span>AI Study Assistant</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono uppercase">
                  AcademicHub AI
                </span>
              </h2>
              <p className="text-xs truncate max-w-md" style={{ color: 'var(--text-muted)' }}>
                Resource: {activeAiResource.title || 'Course Notes'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveAiResource(null)}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div
          className="flex border-b px-6 gap-2 pt-2"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          {[
            { id: 'summary', label: '1-Click PDF Summary', icon: FileText },
            { id: 'notes', label: 'AI Revision Notes', icon: BookOpen },
            { id: 'mcq', label: 'Interactive MCQ Quiz', icon: ListChecks },
            { id: 'chat', label: 'Academic Assistant', icon: Brain },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-t border-x cursor-pointer ${
                  isActive ? 'shadow-xs' : ''
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--surface-card)',
                        color: 'var(--brand-primary)',
                        borderColor: 'var(--border-subtle)',
                        borderBottomColor: 'transparent'
                      }
                    : {
                        color: 'var(--text-secondary)',
                        borderColor: 'transparent'
                      }
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div
          className="flex-1 p-6 overflow-y-auto"
          style={{ backgroundColor: 'var(--bg-main)' }}
        >
          
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-5 animate-fade-in max-w-3xl mx-auto">
              <div className="academic-card p-5">
                <h3 className="font-heading font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>Executive Summary</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {summaryData?.executiveSummary || "Generating instant document synthesis..."}
                </p>
              </div>

              <div className="academic-card p-5">
                <h3 className="font-heading font-bold text-sm text-slate-900 mb-3">Key Takeaways & Concepts</h3>
                <ul className="space-y-2">
                  {summaryData?.keyPoints?.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100">
                <h3 className="font-heading font-bold text-sm text-indigo-950 mb-3">Recommended Study Plan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {summaryData?.studyOutline?.map((item, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-indigo-100 text-xs">
                      <p className="font-semibold text-slate-800">{item.section}</p>
                      <span className="text-[10px] text-indigo-600 font-medium block mt-1">{item.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REVISION NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-5 animate-fade-in max-w-3xl mx-auto">
              <div className="academic-card p-5">
                <h3 className="font-heading font-bold text-sm text-slate-900 mb-3">Concept Cheat Sheet</h3>
                <div className="space-y-2.5">
                  {notesData?.cheatSheet?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <span className="font-bold text-indigo-700 block mb-1">{item.concept}</span>
                      <p className="text-slate-600">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200">
                <h3 className="font-heading font-bold text-sm text-amber-950 mb-2">Key Formulas & Rules</h3>
                <ul className="space-y-1.5 text-xs text-amber-950 font-mono">
                  {notesData?.formulasAndRules?.map((rule, idx) => (
                    <li key={idx}>• {rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: MCQ QUIZ */}
          {activeTab === 'mcq' && (
            <div className="space-y-5 animate-fade-in max-w-3xl mx-auto">
              <div className="academic-card p-4 text-xs flex items-center justify-between">
                <span className="font-bold text-slate-800">AI Quiz Mode: 3 Generated Exam Questions</span>
                <span className="text-indigo-600 font-semibold">Self-Assessment</span>
              </div>

              {mcqData.map(q => (
                <div
                  key={q.id}
                  className="academic-card p-5 space-y-3"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <p className="font-heading font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    Q{q.id}. {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === opt;
                      const isCorrect = opt === q.answer;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-semibold'
                                : 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-semibold'
                              : 'hover:border-indigo-400'
                          }`}
                          style={
                            !isSelected
                              ? {
                                  backgroundColor: 'var(--surface-input)',
                                  borderColor: 'var(--border-subtle)',
                                  color: 'var(--text-primary)'
                                }
                              : {}
                          }
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {userAnswers[q.id] && (
                    <div
                      className="p-3 rounded-xl text-xs border animate-fade-in"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span className="font-bold block mb-1 text-indigo-400">Explanation:</span>
                      <p style={{ color: 'var(--text-secondary)' }}>{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CHAT ASSISTANT */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col justify-between max-w-3xl mx-auto space-y-4">
              <div className="flex-1 space-y-3 overflow-y-auto pr-2 max-h-[400px]">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'border shadow-xs rounded-bl-none font-sans whitespace-pre-wrap'
                      }`}
                      style={
                        msg.sender !== 'user'
                          ? {
                              backgroundColor: 'var(--surface-card)',
                              borderColor: 'var(--border-subtle)',
                              color: 'var(--text-primary)'
                            }
                          : {}
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask any question about this study material..."
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  className="flex-1 text-xs px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{
                    backgroundColor: 'var(--surface-input)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
