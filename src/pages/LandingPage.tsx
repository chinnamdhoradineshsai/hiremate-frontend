import React from 'react';
import { ArrowRight, Menu, FileText, Video, ShieldCheck, MessageSquare, BookOpen, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { AICoreVisualizer } from '../components/3d/AICoreVisualizer';
import SpecularButton from '../components/ui/SpecularButton';

interface LandingPageProps {
  onStart: (tab: string) => void;
  onLogin: () => void;
  onSignUp: () => void;
  onStartDemo: () => void;
  onAdminLogin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onLogin,
  onSignUp,
  onStartDemo,
  onAdminLogin
}) => {
  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* EOS AI Ambient Lighting Highlights */}
      <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-amber-500/8 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-cyan-500/6 rounded-full blur-[160px] pointer-events-none" />

      {/* EOS Header Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-md bg-dark-900/50 border-b border-white/10">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onStart('dashboard')}>
          <div className="w-9 h-9 rounded-full border border-amber-500/40 flex items-center justify-center text-amber-400 font-display font-bold text-sm bg-amber-500/10">
            H
          </div>
          <span className="font-display font-light text-2xl tracking-[0.2em] text-white">
            HIRE<span className="font-bold text-amber-400">MATE</span>
          </span>
        </div>

        {/* Minimal Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] text-slate-300 uppercase">
          <a href="#platform" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            PLATFORM <span className="w-1 h-1 rounded-full bg-amber-400" />
          </a>
          <button onClick={() => onStart('resume')} className="hover:text-amber-400 transition-colors">
            RESUME & ATS
          </button>
          <button onClick={() => onStart('interview')} className="hover:text-amber-400 transition-colors">
            AI INTERVIEW
          </button>
          <button onClick={() => onStart('research')} className="hover:text-amber-400 transition-colors">
            RESEARCH
          </button>
          <button onClick={() => onStart('progress')} className="hover:text-amber-400 transition-colors">
            ANALYTICS
          </button>
        </div>

        {/* Action Controls with SpecularButtons */}
        <div className="flex items-center gap-2.5">
          <SpecularButton
            size="sm"
            onClick={onStartDemo}
            tint="#f59e0b"
            tintOpacity={0.15}
            textColor="#fbbf24"
            lineColor="#f59e0b"
            baseColor="#78350f"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            TRY DEMO
          </SpecularButton>

          <SpecularButton
            size="sm"
            onClick={onLogin}
            tint="#ffffff"
            tintOpacity={0.1}
            textColor="#ffffff"
            lineColor="#ffffff"
            baseColor="#334155"
            className="hidden sm:inline-flex"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-200" />
            LOGIN
          </SpecularButton>

          <SpecularButton
            size="sm"
            onClick={onSignUp}
            tint="#06b6d4"
            tintOpacity={0.15}
            textColor="#22d3ee"
            lineColor="#06b6d4"
            baseColor="#164e63"
            className="hidden sm:inline-flex"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-300" />
            SIGN UP
          </SpecularButton>

          {onAdminLogin && (
            <SpecularButton
              size="sm"
              onClick={onAdminLogin}
              tint="#a855f7"
              tintOpacity={0.2}
              textColor="#e9d5ff"
              lineColor="#c084fc"
              baseColor="#581c87"
              className="hidden md:inline-flex"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              ADMIN LOGIN
            </SpecularButton>
          )}

          <button className="md:hidden text-slate-300 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Hero Stage (Requirements 1 & 15) */}
      <section className="relative pt-36 pb-16 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[90vh] w-full">
        {/* Left Column Text Content */}
        <div className="lg:col-span-6 space-y-8 relative z-10">
          <div className="space-y-3">
            <div className="eyebrow-pill">
              <span className="dot-purple" />
              <span>AI-POWERED CAREER PLATFORM</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-light leading-[1.1] text-white tracking-tight">
              Prepare Smarter. <br />
              Interview Better. <br />
              <span className="font-normal text-amber-400 italic">Get Hired.</span>
            </h1>
          </div>

          <div className="eos-line-divider" />

          <p className="text-slate-300 text-sm md:text-base font-light max-w-md leading-relaxed text-justify">
            HIREMATE turns preparation into offer-ready confidence with static demo evaluations, AI ATS audits, and real-time interview simulations.
          </p>

          {/* Primary Action Button Cluster (Requirements 1 & 15) */}
          <div className="space-y-6 pt-2 max-w-md">
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary HERO TRY DEMO SpecularButton */}
              <SpecularButton
                size="lg"
                onClick={onStartDemo}
                tint="#f59e0b"
                tintOpacity={0.25}
                textColor="#ffffff"
                lineColor="#fbbf24"
                baseColor="#92400e"
                intensity={1.2}
                className="w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                TRY DEMO
              </SpecularButton>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SpecularButton
                  size="md"
                  onClick={onLogin}
                  tint="#ffffff"
                  tintOpacity={0.1}
                  textColor="#f1f5f9"
                  lineColor="#ffffff"
                  baseColor="#475569"
                >
                  <LogIn className="w-4 h-4 text-slate-300" />
                  LOGIN
                </SpecularButton>

                <SpecularButton
                  size="md"
                  onClick={onSignUp}
                  tint="#06b6d4"
                  tintOpacity={0.2}
                  textColor="#67e8f9"
                  lineColor="#22d3ee"
                  baseColor="#0891b2"
                >
                  <UserPlus className="w-4 h-4 text-cyan-300" />
                  SIGN UP
                </SpecularButton>
              </div>
            </div>

            {/* Requirement 15 Divider & Google Auth Hook */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-center sm:text-left font-mono">
              <div className="text-xs text-slate-400">
                Already completed your Demo?
              </div>
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: EOS AI 3D Visualizer */}
        <div className="lg:col-span-6 flex items-center justify-center relative min-h-[420px]">
          <div className="w-full max-w-lg aspect-square flex items-center justify-center relative">
            <AICoreVisualizer state="idle" size={420} interactive={true} />
          </div>
        </div>

        {/* Bottom Left Scroll Indicator */}
        <div className="absolute bottom-6 left-8 md:left-12 hidden sm:flex">
          <div className="eos-scroll-indicator">
            <span>SCROLL</span>
            <div className="line" />
          </div>
        </div>
      </section>

      {/* Platform Entry Points Grid */}
      <section id="platform" className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-12 relative z-10 border-t border-white/5">
        <div className="max-w-xl space-y-3">
          <div className="eos-line-divider" />
          <h2 className="text-3xl font-display font-light text-white">
            Unified Career Intelligence.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your resume and your interview performance continuously synchronize in a single closed-loop AI environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            onClick={() => onStart('resume')}
            className="glass-panel p-8 space-y-6 cursor-pointer hover:border-amber-500/40 transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-display font-light text-2xl text-white">
              Resume & ATS Analyzer
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload your resume for target company parsing, hybrid ATS compatibility scoring, and AI bullet point rewrites.
            </p>
            <div className="btn-eos-circle pt-2">
              <div className="circle-icon">
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </div>
              <span>ANALYZE RESUME</span>
            </div>
          </div>

          <div 
            onClick={() => onStart('interview')}
            className="glass-panel p-8 space-y-6 cursor-pointer hover:border-cyan-500/40 transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-full border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-display font-light text-2xl text-white">
              AI Interview Simulator
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Builds a research-driven interview process adapting difficulty, resume challenges, and question generation dynamically for your selected company and role.
            </p>
            <div className="btn-eos-circle pt-2">
              <div className="circle-icon">
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </div>
              <span>START SIMULATION</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-8 relative z-10 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 space-y-3">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h4 className="font-display font-medium text-white text-base">Source Transparency</h4>
            <p className="text-xs text-slate-400 leading-relaxed">All research items classified as Official 🟢, Publicly Reported 🔵, or AI Inferred 🟣.</p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            <h4 className="font-display font-medium text-white text-base">AI Career Assistant</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Contextually synchronized assistant aware of target role, ATS scores, and interview performance.</p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <h4 className="font-display font-medium text-white text-base">Question History Vault</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Full archive of past questions & evaluations to guarantee fresh questions on retakes.</p>
          </div>
        </div>
      </section>

      {/* EOS Footer with hidden/discreet Admin Login route link */}
      <footer className="border-t border-white/5 py-8 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-4">
          <span className="font-display font-light text-slate-200 text-sm tracking-widest">HIREMATE</span>
          {onAdminLogin && (
            <button
              onClick={onAdminLogin}
              className="text-[10px] text-slate-600 hover:text-amber-400 transition-colors uppercase tracking-wider"
            >
              Admin Portal
            </button>
          )}
        </div>
        <div>Prepare Smarter. Interview Better. Get Hired. © 2026 HireMate AI Inc.</div>
      </footer>
    </div>
  );
};
