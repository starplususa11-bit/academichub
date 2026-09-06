import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../context/ResourceContext';
import ResourceCard from '../components/ResourceCard';
import {
  BookOpen,
  Sparkles,
  Search,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  GraduationCap,
  Layers,
  HelpCircle,
  TrendingUp,
  Download,
  Star,
  Lock,
  FileText,
  BrainCircuit,
  Zap,
  Award,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Home() {
  const { user, token, openLoginModal, openRegisterModal, canUpload } = useAuth();
  const { resources, departments, setIsUploadOpen, setActiveAiResource } = useResources();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('resources');
  const [openFaq, setOpenFaq] = useState(null);

  const featuredResources = resources.slice(0, 4);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleProtectedAction = (targetPath) => {
    if (token) {
      navigate(targetPath);
    } else {
      openLoginModal();
    }
  };

  const faqs = [
    {
      q: "Is AcademicHub completely free for students and university faculty?",
      a: "Yes! AcademicHub is a open academic sharing ecosystem. All students, teaching assistants, and professors can upload, access, download materials, and utilize AI study tools at no cost."
    },
    {
      q: "How does the document moderation process work?",
      a: "Every resource uploaded by students or teachers undergoes automated scanning and human verification by assigned Department Moderators before being publicly indexed."
    },
    {
      q: "How does the AI Study Assistant work?",
      a: "Our AI Study Assistant analyzes lecture slides, lab manuals, and PDFs to generate instant 3-minute summaries, key formula cheat sheets, and 5-question practice quizzes."
    },
    {
      q: "Can I use AcademicHub if my university is not listed?",
      a: "Absolutely. You can select your core department (Computer Science, Electrical Engineering, Mathematics, Physics) and start organizing or sharing course notes immediately."
    }
  ];

  return (
    <div className="space-y-16 animate-fade-in pb-16">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl p-6 sm:p-12 lg:p-16">
        
        {/* Ambient Glowing Background Lights */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Release Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 text-xs font-semibold text-blue-300 shadow-inner backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>AcademicHub 2.0 — Powered by AI Study Assistant</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              Share Notes. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Ace Every Course.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              The ultimate academic sharing ecosystem for students and university faculty. Access verified lecture notes, past exams, lab manuals, and generate AI study summaries in seconds.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {!token ? (
                <>
                  <button
                    onClick={openRegisterModal}
                    className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>

                  <button
                    onClick={openLoginModal}
                    className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur border border-white/20 text-white text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-blue-400" />
                    <span>Sign In</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/resources')}
                    className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.03] flex items-center gap-2"
                  >
                    <span>Browse Resource Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {canUpload ? (
                    <button
                      onClick={() => setIsUploadOpen(true)}
                      className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white text-sm font-bold transition-all hover:scale-[1.03] flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span>Upload Material</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/app/ai-study')}
                      className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white text-sm font-bold transition-all hover:scale-[1.03] flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
                      <span>Launch AI Study Suite</span>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-4 flex items-center gap-4 text-xs text-slate-400">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Student" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Teacher" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Moderator" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Admin" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="font-bold text-white text-xs ml-1">4.9/5</span>
                </div>
                <span>Joined by 15,000+ university students & faculty</span>
              </div>
            </div>

          </div>

          {/* Right Hero Creative Visual Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-2xl backdrop-blur-xl">
              
              {/* Top window bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                  CS-301_AVL_Trees_Notes.pdf
                </span>
              </div>

              {/* Card Preview Body */}
              <div className="py-4 space-y-3">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Data Structures Midterm Prep</h4>
                      <p className="text-[10px] text-slate-400">Prof. Robert Chen • Verified</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                    APPROVED
                  </span>
                </div>

                {/* AI Summary Highlight Box */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" /> AI Quick Summary
                    </span>
                    <span className="text-[9px] text-indigo-200">Generated in 1.2s</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-snug">
                    "AVL Trees maintain balance factor h_L - h_R ∈ &#123;-1, 0, +1&#125;. Single rotations fix SS/DD imbalance; double rotations resolve SD/DS cases."
                  </p>
                </div>

                {/* Simulated Quiz Card */}
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-300 font-medium">Practice MCQ Quiz (5 Qs)</span>
                  </div>
                  <span className="text-xs text-purple-400 font-bold hover:underline cursor-pointer">
                    Start Test →
                  </span>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-xl border border-blue-400/30 flex items-center gap-2 text-xs font-semibold animate-bounce">
                <ShieldCheck className="w-4 h-4 text-blue-200" />
                <span>100% Verified Academic Content</span>
              </div>

            </div>
          </div>

        </div>

        {/* Floating Quick Stats Counter */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">450+</span>
            <span className="block text-xs text-slate-400 font-medium mt-1">Verified Resources</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">12.4k+</span>
            <span className="block text-xs text-slate-400 font-medium mt-1">Student Downloads</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">14</span>
            <span className="block text-xs text-slate-400 font-medium mt-1">Academic Depts</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">99.4%</span>
            <span className="block text-xs text-slate-400 font-medium mt-1">Moderation Accuracy</span>
          </div>
        </div>

      </div>

      {/* INTERACTIVE FEATURE SHOWCASE */}
      <div>
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Everything You Need To Excel
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            A Complete Academic Learning Platform
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Designed to connect students, course instructors, and moderators seamlessly.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div
            className="p-7 rounded-3xl border shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-blue-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Verified Resource Hub</h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Access clean, categorized lecture notes, past exam solutions, and lab manuals organized by university course codes.
            </p>
            <button
              onClick={() => handleProtectedAction('/resources')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
            >
              <span>Explore Materials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className="p-7 rounded-3xl border shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-indigo-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>AI Study Assistant</h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Generate 3-minute executive summaries, key formula cheat sheets, and 5-question practice quizzes from long PDF documents.
            </p>
            <button
              onClick={() => setActiveAiResource({ title: "General Academic Assistant" })}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
            >
              <span>Try AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className="p-7 rounded-3xl border shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-purple-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Course Q&A & Peer Help</h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Ask tough assignment questions, get step-by-step solutions from classmates, and see verified answers endorsed by professors.
            </p>
            <button
              onClick={() => handleProtectedAction('/qa')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
            >
              <span>Open Q&A Forum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* EXPLORE BY DEPARTMENT GRID */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Explore Academic Faculties</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Access organized course repositories per department</p>
          </div>
          <button 
            onClick={() => handleProtectedAction('/resources')}
            className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => (
            <div
              key={dept.id}
              onClick={() => handleProtectedAction(`/resources?department=${dept.id}`)}
              className="p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all group flex items-start gap-4 cursor-pointer hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{dept.code}</span>
                <h3 className="font-heading font-bold text-sm group-hover:text-indigo-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {dept.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {dept.coursesCount} Courses • {dept.resourcesCount} Verified Docs
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRENDING STUDY MATERIALS CATALOG */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Trending Study Materials</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Most downloaded lecture slides and exam preparation sets</p>
          </div>
          <button 
            onClick={() => handleProtectedAction('/resources')}
            className="text-xs text-indigo-400 font-semibold hover:underline cursor-pointer"
          >
            Browse Full Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredResources.map(res => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
            Simple 3-Step Process
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl">How AcademicHub Works</h2>
          <p className="text-xs text-slate-400">Get started in under 60 seconds with your university email</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <div className="text-center space-y-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
              1
            </div>
            <h3 className="font-heading font-bold text-base">Create Your Account</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign up as a Student or Faculty member. Select your department and active enrolled courses.
            </p>
          </div>

          <div className="text-center space-y-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
              2
            </div>
            <h3 className="font-heading font-bold text-base">Upload & Discover</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload verified course materials or search thousands of notes curated by top academic students.
            </p>
          </div>

          <div className="text-center space-y-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30">
              3
            </div>
            <h3 className="font-heading font-bold text-base">Ace Exams with AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use our AI assistant to summarize 50-page slides into 3-minute cheat sheets and test yourself with AI quizzes.
            </p>
          </div>

        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ Accordion) */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-heading font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Everything you need to know about AcademicHub</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border overflow-hidden shadow-xs transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left font-heading font-semibold text-sm flex justify-between items-center transition-colors cursor-pointer"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                )}
              </button>
              {openFaq === idx && (
                <div
                  className="px-6 pb-4 text-xs leading-relaxed border-t pt-3"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA CALL TO ACTION BANNER */}
      {!token && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white p-8 sm:p-12 text-center shadow-2xl space-y-6">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl leading-tight">
              Ready to Join 15,000+ Students & Elevate Your Learning?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium">
              Create your free account today and get instant access to verified course notes, AI summaries, and academic Q&A.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={openRegisterModal}
                className="px-8 py-4 rounded-xl bg-white text-indigo-900 text-sm font-extrabold shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
              >
                Create Free Account
              </button>
              <button
                onClick={openLoginModal}
                className="px-8 py-4 rounded-xl bg-indigo-950/40 hover:bg-indigo-950/60 backdrop-blur border border-white/20 text-white text-sm font-bold transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
