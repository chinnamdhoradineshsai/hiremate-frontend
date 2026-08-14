import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, ArrowUpRight, RefreshCw, XCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiService } from '../services/api';
import type { DashboardData } from '../types';

export const ProgressAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.getDashboardAnalytics();
      setData(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load progress analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <p className="text-slate-400 font-mono text-xs animate-pulse">Loading Progress Analytics Data...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="p-8 max-w-xl mx-auto space-y-4">
        <div className="glass-panel p-8 border-red-500/40 bg-red-500/10 text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white font-display">Analytics Error</h2>
          <p className="text-xs text-red-300">{errorMsg || 'Unable to load analytics data.'}</p>
          <button
            onClick={loadAnalytics}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-red-500 hover:bg-red-400 text-white shadow-md transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
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
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="eyebrow-pill mb-2">
          <span className="dot-cyan" />
          <span>Long-Term Analytics Command Center</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold font-display text-white">
          Progress & Performance Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Longitudinal score progression across ATS audits, technical rounds, aptitude assessments, and HR interviews.
        </p>
      </div>

      {/* 4 Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ATS Score */}
        <div className="glass-card p-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-400">ATS Compatibility</div>
          {data.ats_card.score !== null && data.ats_card.score !== undefined ? (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black font-mono text-white">{data.ats_card.score}</span>
                <span className="text-xs font-mono text-slate-500">/ 100</span>
              </div>
              <div className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> {data.ats_card.delta_text || 'Latest Analysis'}
              </div>
            </>
          ) : (
            <div className="text-xs font-mono text-slate-400 py-1">No ATS analysis yet</div>
          )}
        </div>

        {/* Interview Readiness */}
        <div className="glass-card p-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-400">Interview Readiness</div>
          {data.interview_card.readiness !== null && data.interview_card.readiness !== undefined ? (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black font-mono grad-text-cyan">{data.interview_card.readiness}</span>
                <span className="text-xs font-mono text-slate-500">/ 100</span>
              </div>
              <div className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> {data.interview_card.delta_text || 'Active Assessment'}
              </div>
            </>
          ) : (
            <div className="text-xs font-mono text-slate-400 py-1">No interviews yet</div>
          )}
        </div>

        {/* Technical Average */}
        <div className="glass-card p-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-400">Technical Average</div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black font-mono text-emerald-400">
              {data.interview_card.breakdown && data.interview_card.breakdown.technical !== null ? data.interview_card.breakdown.technical : 'N/A'}
            </span>
            {data.interview_card.breakdown && data.interview_card.breakdown.technical !== null && <span className="text-xs font-mono text-slate-500">/ 100</span>}
          </div>
          <div className="text-xs font-mono font-semibold text-slate-400">Technical round score</div>
        </div>

        {/* HR Round Average */}
        <div className="glass-card p-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-400">HR Round Average</div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black font-mono text-amber-400">
              {data.interview_card.breakdown && data.interview_card.breakdown.hr !== null ? data.interview_card.breakdown.hr : 'N/A'}
            </span>
            {data.interview_card.breakdown && data.interview_card.breakdown.hr !== null && <span className="text-xs font-mono text-slate-500">/ 100</span>}
          </div>
          <div className="text-xs font-mono font-semibold text-slate-400">HR round score</div>
        </div>
      </div>

      {/* Main Progression Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Score Progression Over Practice Attempts
              </h3>
              <p className="text-xs text-slate-400">Tracks ATS improvements alongside Aptitude, Technical & HR round ratings</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4 flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0A0E1A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="ATS" name="ATS Score" stroke="#7C3AED" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Interview" name="Interview Readiness" stroke="#06B6D4" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Technical" name="Technical" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="HR" name="HR Score" stroke="#F59E0B" strokeWidth={2} strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center space-y-3 py-10">
                <TrendingUp className="w-12 h-12 text-purple-400/40 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">Complete your first ATS analysis or interview simulation to unlock progress analytics.</p>
                <div className="flex justify-center gap-3 pt-1">
                  <button onClick={() => window.location.hash = '#resume'} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-dark-900 shadow-md">Analyze Resume</button>
                  <button onClick={() => window.location.hash = '#interview'} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Start Interview</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ATS Skill Breakdown */}
        <div className="lg:col-span-4 glass-panel p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-white mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              ATS Breakdown Ratings
            </h3>
            <p className="text-xs text-slate-400 mb-4">Latest resume audit component ratings</p>
          </div>

          {data.ats_card.breakdown ? (
            <div className="space-y-3">
              {Object.entries(data.ats_card.breakdown).map(([key, val]) => (
                <div key={key} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300 capitalize">{key.replace('_', ' ')}</span>
                    <span className="font-mono text-purple-300 font-bold">{val}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-1000"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs font-mono text-slate-400">
              No ATS breakdown ratings available. Upload a resume to generate ratings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
