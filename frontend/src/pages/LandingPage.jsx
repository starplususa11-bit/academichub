import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Sparkles,
  Search,
  Upload,
  ArrowRight,
  ShieldCheck,
  Users,
  Zap,
  FileText,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Layers,
  Star,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [heroTab, setHeroTab] = useState('ai');
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [heroBookmarked, setHeroBookmarked] = useState(false);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleCtaClick = () => {
    if (token) {
      navigate('/app/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const faqs = [
    {
      q: "Is AcademicHub completely free for students and university faculty?",
      a: "Yes! AcademicHub is a free academic sharing ecosystem. All students, TAs, and professors can upload, access, download materials, and utilize AI study tools at no cost."
    },
    {
      q: "How does document moderation work?",
      a: "Every resource uploaded by students or teachers undergoes automated scanning and verification by assigned Department Moderators before being publicly indexed."
    },
    {
      q: "How does the AI Study Assistant work?",
      a: "Our AI Study Assistant analyzes lecture slides, lab manuals, and PDFs to generate instant 3-minute summaries, key formula cheat sheets, 5-question practice quizzes, and flashcards."
    },
    {
      q: "Can I access private application pages without logging in?",
      a: "No. Private academic areas like Student/Teacher Dashboards, full Resource Repositories, Q&A, and Study Groups require user authentication."
    }
  ];

  return (
    <div className="space-y-20 pb-20 animate-fade-in overflow-x-hidden w-full">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        
        {/* Glow backdrop lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>Next-Gen Academic Sharing & AI Learning Platform</span>
              </div>

              <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-slate-900 tracking-tight leading-[1.1]">
                Your academic life, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800">
                  organized.
                </span>
              </h1>

              <p className="text-base text-slate-600 font-normal leading-relaxed max-w-xl">
                Discover verified course notes, collaborate with classmates, get coursework answers, and study 5x faster with AI summaries — all in one unified academic workspace.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleCtaClick}
                  className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>{token ? 'Go to Dashboard' : 'Get Started Free'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!token && (
                  <Link
                    to="/login"
                    className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold transition-all flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-indigo-600" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>

              {/* Social Proof Bar */}
              <div className="pt-6 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-200/80">
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Student" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Teacher" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Moderator" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="font-bold text-slate-900 text-xs ml-1">4.9/5</span>
                  </div>
                  <span>Joined by 15,000+ university students & faculty</span>
                </div>
              </div>

            </div>

            {/* Right Creative Interactive Workspace Showcase */}
            <div className="lg:col-span-5 relative">
              {/* Vibrant Ambient Glow Backdrop */}
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-gradient-to-tr from-indigo-500/20 via-violet-400/20 to-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
              <div className="absolute -bottom-8 -right-6 w-64 h-64 bg-gradient-to-br from-blue-500/20 via-cyan-400/20 to-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

              {/* Floating Live Badge 1: Top Right */}
              <div className="absolute -top-4 -right-2 sm:-right-4 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-lg shadow-indigo-500/5 animate-bounce-subtle">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-800">1,420+ Scholars Active</span>
              </div>

              {/* Floating Live Badge 2: Bottom Left */}
              <div className="absolute -bottom-5 -left-2 sm:-left-5 z-20 hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm font-bold text-xs">
                  ★
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                    <span>99.4% Pass Rate</span>
                    <span className="text-emerald-600 font-extrabold text-[10px]">↑ 18%</span>
                  </div>
                  <div className="text-[10px] text-slate-500">From AI exam simulations</div>
                </div>
              </div>

              {/* Main Showcase Glass Card */}
              <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xl shadow-indigo-950/10 space-y-4 relative transition-all">
                
                {/* Header with Department & Mode Tabs */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                    <span className="ml-1 text-[11px] font-mono font-semibold text-slate-500 bg-slate-100/90 px-2 py-0.5 rounded-md">
                      CS-201 • DSA
                    </span>
                  </div>
                  
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified by Faculty
                  </span>
                </div>

                {/* Interactive Mode Pills */}
                <div className="grid grid-cols-3 p-1 bg-slate-100/80 rounded-xl gap-1 text-[11px] sm:text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setHeroTab('ai')}
                    className={`py-1.5 px-1 sm:px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                      heroTab === 'ai'
                        ? 'bg-white text-indigo-600 shadow-xs font-bold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">AI Study</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHeroTab('quiz')}
                    className={`py-1.5 px-1 sm:px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                      heroTab === 'quiz'
                        ? 'bg-white text-indigo-600 shadow-xs font-bold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">Quiz</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHeroTab('notes')}
                    className={`py-1.5 px-1 sm:px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                      heroTab === 'notes'
                        ? 'bg-white text-indigo-600 shadow-xs font-bold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">Notes</span>
                  </button>
                </div>

                {/* Dynamic Content Panel Based on Tab */}
                <div className="min-h-[195px] flex flex-col justify-between">
                  {heroTab === 'ai' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/60 border border-indigo-100/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                            3-Min Concept Synthesis
                          </span>
                          <span className="text-[10px] font-mono text-indigo-500 bg-indigo-100/60 px-1.5 py-0.5 rounded">
                            Confidence 99.8%
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          <strong className="text-slate-900">AVL Tree Rebalancing:</strong> Double rotations (RL or LR) resolve inner subtree overhangs. An RL insertion first rotates the right child to the right, followed by a left rotation on the parent.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                          <span className="text-slate-500">Balance Factor:</span>
                          <span className="font-mono font-bold text-indigo-600">&#123;-1, 0, +1&#125;</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                          <span className="text-slate-500">Complexity:</span>
                          <span className="font-mono font-bold text-indigo-600">O(log N)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {heroTab === 'quiz' && (
                    <div className="space-y-2.5 animate-fade-in">
                      <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs font-semibold text-amber-900 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 text-[11px] font-bold">
                          Q1
                        </span>
                        <span>What is the worst-case lookup complexity in an AVL Tree?</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { id: 'a', text: 'O(N)', correct: false },
                          { id: 'b', text: 'O(log N)', correct: true },
                          { id: 'c', text: 'O(N log N)', correct: false },
                          { id: 'd', text: 'O(1)', correct: false }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedQuizOption(opt.id)}
                            className={`p-2 rounded-xl text-left font-medium transition-all border text-xs flex items-center justify-between ${
                              selectedQuizOption === opt.id
                                ? opt.correct
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold ring-2 ring-emerald-400/20'
                                  : 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90'
                            }`}
                          >
                            <span>{opt.text}</span>
                            {selectedQuizOption === opt.id && (
                              <span className="text-[10px]">
                                {opt.correct ? '✓ Correct!' : '✕ Try again'}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      {selectedQuizOption && (
                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200/70 flex items-center justify-between">
                          <span>Click any option to test your understanding!</span>
                          <button
                            type="button"
                            onClick={() => setSelectedQuizOption(null)}
                            className="text-indigo-600 font-bold hover:underline"
                          >
                            Reset
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {heroTab === 'notes' && (
                    <div className="space-y-2.5 animate-fade-in">
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-bold text-xs text-slate-900">
                              Complete Tree Traversal & Balancing Guide
                            </h5>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Dr. Robert Chen • 45 Pages • Includes C++ & Python Code
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setHeroBookmarked(!heroBookmarked)}
                            className={`p-1.5 rounded-lg border text-xs transition-colors ${
                              heroBookmarked
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                            }`}
                            title="Bookmark"
                          >
                            ★
                          </button>
                        </div>

                        <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            ⭐ 4.9 (48 ratings)
                          </span>
                          <span>•</span>
                          <span>342 downloads</span>
                          <span>•</span>
                          <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">
                            PDF • 4.8MB
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-indigo-600 text-white flex items-center justify-between text-xs shadow-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-200" />
                          <span className="font-semibold">Ready to read full PDF preview?</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCtaClick}
                          className="bg-white text-indigo-600 font-bold px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors text-[11px]"
                        >
                          Open Document
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Quick Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Real-time university workspace</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCtaClick}
                    className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 text-[11px] group"
                  >
                    <span>Explore Repository</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PLATFORM CAPABILITIES */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Platform Capabilities
          </span>
          <h2 className="font-heading font-extrabold text-3xl text-slate-900">
            Built for Serious University Learning
          </h2>
          <p className="text-sm text-slate-600">
            Combining resource discovery, peer Q&A, group collaboration, and AI study suites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="academic-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">Academic Resources</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Find verified lecture notes, past papers, lab manuals, assignments, and presentations indexed by course codes.
            </p>
          </div>

          <div className="academic-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">AI Study Suite</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Summarize 50-page slides in 10 seconds, generate 5-question practice quizzes, and review concept flashcards.
            </p>
          </div>

          <div className="academic-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">Peer & Faculty Q&A</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask difficult coursework questions, upvote step-by-step solutions, and see verified answers from professors.
            </p>
          </div>
        </div>
      </section>


      {/* AI SECTION */}
      <section id="ai-study" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="academic-card p-8 sm:p-12 bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Study Suite</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl">
              Study 5x Faster with Context-Aware AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              AcademicHub's built-in AI assistant reads lecture slides and course documents alongside you, answering questions with exact course context.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-lg bg-white/10 text-indigo-200 border border-white/10">Ask AI</span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-indigo-200 border border-white/10">Explain Concept</span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-indigo-200 border border-white/10">Summarize PDF</span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-indigo-200 border border-white/10">Quiz Me</span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-indigo-200 border border-white/10">Flashcards</span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 font-sans text-xs">
            <div className="bg-slate-800 p-3 rounded-xl text-slate-200">
              <span className="font-bold text-indigo-400 block mb-1">Student Question:</span>
              "Explain AVL Tree balance factor in simple terms."
            </div>
            <div className="bg-indigo-950 p-3.5 rounded-xl border border-indigo-500/30 text-slate-100">
              <span className="font-bold text-indigo-300 block mb-1">AcademicHub AI:</span>
              "A balance factor is the difference between left and right subtree heights: Height(Left) - Height(Right). It must strictly remain within &#123;-1, 0, +1&#125;. If it reaches ±2, rotation is triggered."
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-3xl mx-auto px-4 space-y-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-heading font-extrabold text-2xl text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about AcademicHub</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="academic-card overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left font-heading font-semibold text-sm text-slate-900 flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-indigo-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="academic-card p-8 sm:p-12 text-center bg-indigo-600 text-white space-y-6">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">
            Ready to Study Smarter?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mx-auto">
            Join thousands of students and faculty members organizing their academic materials on AcademicHub.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handleCtaClick}
              className="px-8 py-3.5 rounded-xl bg-white text-indigo-900 text-xs font-bold shadow-md hover:bg-slate-100 transition-all"
            >
              {token ? 'Go to Dashboard' : 'Get Started Free'}
            </button>
            {!token && (
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-xl bg-indigo-700 text-white text-xs font-bold hover:bg-indigo-800 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
