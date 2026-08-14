import React, { useState, useEffect } from 'react';
import { FileText, Video, Award, TrendingUp, Play, History, ArrowUpRight, RefreshCw, XCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AICoreVisualizer } from '../components/3d/AICoreVisualizer';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { apiService } from '../services/api';
import type { DashboardData } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.getDashboardAnalytics();
      setData(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <AICoreVisualizer state="thinking" size={180} />
          <p className="text-slate-400 font-mono text-xs animate-pulse">Loading AI Command Center...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="p-8 max-w-xl mx-auto space-y-6">
        <div className="glass-panel p-8 border-red-500/40 bg-red-500/10 text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white font-display">Dashboard Error</h2>
          <p className="text-xs text-red-300">{errorMsg || 'Failed to load user analytics.'}</p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={loadDashboard}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-red-500 hover:bg-red-400 text-white shadow-md transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>

        </div>
      </div>
    );
  }

  const hasChartData = data.progress_trends && data.progress_trends.labels && data.progress_trends.labels.length > 0;
  const chartData = hasChartData
    ? data.progress_trends.labels.map((label, idx) => ({
        name: label,
        ATS: data.progress_trends.ats_progress[idx] ?? 0,
        Interview: data.progress_trends.interview_progress[idx] ?? 0,
        Technical: data.progress_trends.technical_progress[idx] ?? 0,
        Aptitude: data.progress_trends.aptitude_progress[idx] ?? 0,
        HR: data.progress_trends.hr_progress[idx] ?? 0
      }))
    : [];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Hero Greeting & Interactive 3D EOS AI Core */}
      <div className="glass-panel p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">EOS AI COMMAND CENTER</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-light text-white">
            Welcome back, <span className="font-bold text-amber-400">{data.user_profile.name}</span>.
          </h1>
          <p className="text-slate-300 text-base font-light max-w-xl">
            Let's get you interview-ready.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('resume')}
              className="px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase bg-amber-500 hover:bg-amber-400 text-dark-900 shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4 text-dark-900" />
              Analyze My Resume
            </button>

            <button
              onClick={() => onNavigate('interview')}
              className="px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase bg-dark-800 hover:bg-dark-700 text-white border border-white/15 hover:border-amber-400/40 shadow-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <Video className="w-4 h-4 text-cyan-400" />
              Start AI Interview
            </button>
          </div>
        </div>

        {/* EOS 3D Monolith & Ringed Core */}
        <div className="w-48 h-48 md:w-56 md:h-56 flex items-center justify-center shrink-0">
          <AICoreVisualizer state="idle" size={210} interactive={true} />
        </div>
      </div>

      {/* 4 Main Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: ATS Score */}
        <div className="glass-card p-5 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">ATS SCORE</div>
          {data.ats_card.score !== null && data.ats_card.score !== undefined ? (
            <>
              <div className="flex items-baseline gap-1">
                <AnimatedCounter value={data.ats_card.score} className="text-4xl font-black text-white font-mono" />
                <span className="text-slate-500 font-mono text-sm">/ 100</span>
              </div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> {data.ats_card.delta_text || 'Current Resume Analysis'}
              </div>
            </>
          ) : (
            <div className="space-y-2 py-1">
              <div className="text-sm font-semibold text-slate-400">No ATS analysis yet</div>
              <button
                onClick={() => onNavigate('resume')}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                Analyze Resume →
              </button>
            </div>
          )}
        </div>

        {/* Metric 2: Interview Readiness */}
        <div className="glass-card p-5 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">INTERVIEW READINESS</div>
          {data.interview_card.readiness !== null && data.interview_card.readiness !== undefined ? (
            <>
              <div className="flex items-baseline gap-1">
                <AnimatedCounter value={data.interview_card.readiness} className="text-4xl font-black font-mono text-amber-400" />
                <span className="text-slate-500 font-mono text-sm">/ 100</span>
              </div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> {data.interview_card.delta_text || 'Recent Performance'}
              </div>
            </>
          ) : (
            <div className="space-y-2 py-1">
              <div className="text-sm font-semibold text-slate-400">No interviews yet</div>
              <button
                onClick={() => onNavigate('interview')}
                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                Start AI Interview →
              </button>
            </div>
          )}
        </div>

        {/* Metric 3: Questions Answered */}
        <div className="glass-card p-5 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">QUESTIONS ANSWERED</div>
          <div className="flex items-baseline">
            <AnimatedCounter value={data.total_questions_answered ?? 0} className="text-4xl font-black text-white font-mono" />
          </div>
          <div className="text-xs text-slate-400">Across Aptitude, Tech & HR</div>
        </div>

        {/* Metric 4: Skills to Improve */}
        <div className="glass-card p-5 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">SKILLS TO IMPROVE</div>
          <div className="flex items-baseline">
            <AnimatedCounter value={data.weak_skills ? data.weak_skills.length : 0} className="text-4xl font-black text-cyan-400 font-mono" />
          </div>
          <div className="text-xs text-cyan-400 font-medium">
            {data.weak_skills && data.weak_skills.length > 0 ? 'Targeted in roadmap' : 'No skill gaps identified yet'}
          </div>
        </div>
      </div>

      {/* Performance Visualization Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Performance Progression Visualizer
              </h3>
              <p className="text-xs text-slate-400">ATS, Aptitude, Technical, Coding, and HR round improvement trends</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2 flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B101D', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="ATS" name="ATS Score" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Interview" name="Interview Readiness" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Technical" name="Technical" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="Aptitude" name="Aptitude" stroke="#FBBF24" strokeWidth={2} strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center space-y-2 py-8">
                <p className="text-xs font-mono text-slate-400">Complete your first ATS analysis or interview to view progression trends.</p>
                <div className="flex justify-center gap-3 pt-1">
                  <button onClick={() => onNavigate('resume')} className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Analyze Resume</button>
                  <button onClick={() => onNavigate('interview')} className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Start Interview</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Latest Interview Card */}
        <div className="lg:col-span-4 glass-panel p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Latest Interview
              </h3>
              {data.recent_interview && <span className="text-[11px] font-mono text-slate-400">{data.recent_interview.date}</span>}
            </div>

            {data.recent_interview ? (
              <>
                <div>
                  <h4 className="text-xl font-display font-bold text-white">{data.recent_interview.company}</h4>
                  <p className="text-xs text-slate-400 font-medium">{data.recent_interview.role}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Overall Score</span>
                    <span className="font-extrabold text-amber-400 font-mono text-sm">{data.recent_interview.score}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="text-slate-300">Aptitude: <strong className="text-amber-300 font-mono">{data.recent_interview.aptitude_score || 0}%</strong></div>
                    <div className="text-slate-300">Technical: <strong className="text-cyan-300 font-mono">{data.recent_interview.technical_score || 0}%</strong></div>
                    <div className="text-slate-300">Coding: <strong className="text-emerald-300 font-mono">{data.recent_interview.coding_score || 0}%</strong></div>
                    <div className="text-slate-300">HR: <strong className="text-amber-300 font-mono">{data.recent_interview.hr_score || 0}%</strong></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-slate-400 font-medium">No interviews completed yet.</p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => onNavigate('interview')}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Start AI Interview
            </button>
          </div>
        </div>
      </div>

      {/* Interview History Timeline */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          Interview History Timeline
        </h3>

        {data.total_interviews_taken > 0 && data.recent_interview ? (
          <div className="space-y-3">
            <div className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base font-display">
                    {data.recent_interview.company} — {data.recent_interview.role}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex flex-wrap gap-4 pt-1">
                  <span>Technical: <strong className="text-cyan-300 font-mono">{data.recent_interview.technical_score || 0}%</strong></span>
                  <span>Aptitude: <strong className="text-amber-300 font-mono">{data.recent_interview.aptitude_score || 0}%</strong></span>
                  <span>HR: <strong className="text-emerald-300 font-mono">{data.recent_interview.hr_score || 0}%</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-amber-400">{data.recent_interview.score}%</span>
                <button onClick={() => onNavigate('interview')} className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10">
                  Retake Session
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs font-mono text-slate-400">
            No interview history recorded yet. Complete an interview simulation to unlock your timeline.
          </div>
        )}
      </div>
    </div>
  );
};
