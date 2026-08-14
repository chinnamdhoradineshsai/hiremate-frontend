import React from 'react';
import {
  Sparkles, Award, FileText, Video, BookOpen, LogIn, Home, CheckCircle2
} from 'lucide-react';
import { AICoreVisualizer } from '../components/3d/AICoreVisualizer';

interface DifficultyStats {
  total: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number;
}

interface DemoDashboardPageProps {
  demoSummary?: {
    overall_score?: number;
    aptitudeScore?: number;
    technicalScore?: number;
    totalObjectiveScore?: number;
    hrCompletedCount?: number;
    hrVoiceCount?: number;
    hrTextCount?: number;
    totalAttempted?: number;
    totalUnanswered?: number;
    aptEasy?: DifficultyStats;
    aptMed?: DifficultyStats;
    aptHard?: DifficultyStats;
    techEasy?: DifficultyStats;
    techMed?: DifficultyStats;
    techHard?: DifficultyStats;
    hrEasy?: DifficultyStats;
    hrMed?: DifficultyStats;
    hrHard?: DifficultyStats;
    answers?: Record<number, any>;
  };
  onLoginClick?: () => void;
  onRetakeDemo?: () => void;
  onGoHome?: () => void;
}

export const DemoDashboardPage: React.FC<DemoDashboardPageProps> = ({
  demoSummary,
  onLoginClick,
  onRetakeDemo,
  onGoHome
}) => {
  const aptScore = demoSummary?.aptitudeScore ?? 0;
  const techScore = demoSummary?.technicalScore ?? 0;
  const totalObj = demoSummary?.totalObjectiveScore ?? 0;
  const hrScore = demoSummary?.hrCompletedCount ?? 0;
  const totalAttempted = demoSummary?.totalAttempted ?? 0;
  const totalUnanswered = demoSummary?.totalUnanswered ?? 70;

  const aptPct = Math.round((aptScore / 30) * 100);
  const techPct = Math.round((techScore / 30) * 100);
  const hrPct = Math.round((hrScore / 10) * 100);
  const overallScore = Math.round((totalObj / 60) * 100);

  const aptEasy = demoSummary?.aptEasy ?? { attemptedCount: 0, total: 10, correctCount: 0 };
  const aptMed = demoSummary?.aptMed ?? { attemptedCount: 0, total: 10, correctCount: 0 };
  const aptHard = demoSummary?.aptHard ?? { attemptedCount: 0, total: 10, correctCount: 0 };

  const techEasy = demoSummary?.techEasy ?? { attemptedCount: 0, total: 10, correctCount: 0 };
  const techMed = demoSummary?.techMed ?? { attemptedCount: 0, total: 10, correctCount: 0 };
  const techHard = demoSummary?.techHard ?? { attemptedCount: 0, total: 10, correctCount: 0 };

  const hrEasy = demoSummary?.hrEasy ?? { attemptedCount: 0, total: 3, correctCount: 0 };
  const hrMed = demoSummary?.hrMed ?? { attemptedCount: 0, total: 3, correctCount: 0 };
  const hrHard = demoSummary?.hrHard ?? { attemptedCount: 0, total: 4, correctCount: 0 };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Demo Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold uppercase tracking-wider font-mono">LIVE DEMO DASHBOARD ACTIVE</span>
            <p className="text-slate-300 font-sans text-[11px] mt-0.5">
              Metrics update live in real-time across Easy, Medium, and Hard difficulty levels for Aptitude, Technical, and HR rounds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Home className="w-4 h-4 text-amber-400" />
              Return to Main Page
            </button>
          )}

          <button
            onClick={onLoginClick}
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white hover:bg-slate-100 text-dark-900 shadow-md transition-all hover:scale-105 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4 text-dark-900" />
            Sign in with Google
          </button>
        </div>
      </div>

      {/* Hero Welcome & 3D Core */}
      <div className="glass-panel p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="eyebrow-pill">
            <span className="dot-gold" />
            <span>Interactive Demo Command Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-display text-white tracking-tight leading-tight">
            Welcome to <span className="text-amber-400">HireMate</span> Live Dashboard.
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
            Real-time difficulty-specific score & progress tracking for your current Demo session across 🟢 Easy, 🟡 Medium, and 🔴 Hard levels.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onRetakeDemo}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-400 text-dark-900 shadow-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              Return to Questions
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex items-center justify-center">
          <AICoreVisualizer state="idle" size={240} />
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Attempted Card */}
        <div className="glass-card p-6 space-y-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Questions Attempted</span>
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-400 font-mono">{totalAttempted}</span>
            <span className="text-xs font-mono text-slate-400">/ 70</span>
          </div>
          <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.round((totalAttempted / 70) * 100)}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Unanswered: {totalUnanswered} questions</p>
        </div>

        {/* Objective Accuracy Card */}
        <div className="glass-card p-6 space-y-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Objective Score</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-400 font-mono">{totalObj}</span>
            <span className="text-xs font-mono text-slate-400">/ 60 marks</span>
          </div>
          <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${overallScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Accuracy: {overallScore}%</p>
        </div>

        {/* HR Responses Card */}
        <div className="glass-card p-6 space-y-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">HR Responses</span>
            <Video className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-purple-400 font-mono">{hrScore}</span>
            <span className="text-xs font-mono text-slate-400">/ 10</span>
          </div>
          <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: `${hrPct}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Voice: {demoSummary?.hrVoiceCount ?? 0} | Text: {demoSummary?.hrTextCount ?? 0}</p>
        </div>

        {/* Sample ATS Card */}
        <div className="glass-card p-6 space-y-4 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Resume ATS Preview</span>
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-mono">78</span>
            <span className="text-xs font-mono text-slate-400">/ 100 (Sample)</span>
          </div>
          <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: '78%' }} />
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Sign in to upload PDF resume</p>
        </div>
      </div>

      {/* Difficulty-Specific Round Performance Breakdown Grid (Requirement 13) */}
      <div className="glass-panel p-6 space-y-6">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          Live Assessment Breakdown by Round & Difficulty
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Aptitude Difficulty Breakdown */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono border-b border-white/10 pb-2">
              <span className="font-bold text-amber-400">APTITUDE ROUND</span>
              <span className="text-amber-400 font-bold">{aptScore} / 30 ({aptPct}%)</span>
            </div>
            
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>🟢 Easy:</span>
                <span className="font-bold text-emerald-400">{aptEasy.attemptedCount} / 10 attempted</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>🟡 Medium:</span>
                <span className="font-bold text-amber-400">{aptMed.attemptedCount} / 10 attempted</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>🔴 Hard:</span>
                <span className="font-bold text-rose-400">{aptHard.attemptedCount} / 10 attempted</span>
              </div>
            </div>
          </div>

          {/* Technical Difficulty Breakdown */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono border-b border-white/10 pb-2">
              <span className="font-bold text-cyan-400">TECHNICAL ROUND</span>
              <span className="text-cyan-400 font-bold">{techScore} / 30 ({techPct}%)</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>🟢 Easy:</span>
                <span className="font-bold text-emerald-400">{techEasy.attemptedCount} / 10 attempted</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>🟡 Medium:</span>
                <span className="font-bold text-amber-400">{techMed.attemptedCount} / 10 attempted</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>🔴 Hard:</span>
                <span className="font-bold text-rose-400">{techHard.attemptedCount} / 10 attempted</span>
              </div>
            </div>
          </div>

          {/* HR Difficulty Breakdown */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono border-b border-white/10 pb-2">
              <span className="font-bold text-purple-400">HR ROUND</span>
              <span className="text-purple-400 font-bold">{hrScore} / 10 ({hrPct}%)</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>🟢 Easy:</span>
                <span className="font-bold text-emerald-400">{hrEasy.attemptedCount} / 3 answered</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>🟡 Medium:</span>
                <span className="font-bold text-amber-400">{hrMed.attemptedCount} / 3 answered</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>🔴 Hard:</span>
                <span className="font-bold text-rose-400">{hrHard.attemptedCount} / 4 answered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
