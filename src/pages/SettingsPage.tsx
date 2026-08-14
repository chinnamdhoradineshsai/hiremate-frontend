import React from 'react';
import { Settings, Cpu, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <div className="eyebrow-pill mb-2">
          <span className="dot-cyan" />
          <span>Security & Architecture Gateway</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold font-display text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-purple-400" />
          Centralized AI Gateway & Platform Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Zero cloud API keys exposed to React frontend. Unified configuration managed securely via backend environment.
        </p>
      </div>

      {/* AI Gateway Architecture Panel */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white font-display">HireMate AI Router Status</h2>
              <p className="text-xs text-slate-400 font-mono">FastAPI backend `/app/services/ai/ai_gateway.py`</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURED & ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <span className="font-mono font-bold text-purple-300 uppercase block">Primary Reasoning Engine</span>
            <div className="flex justify-between text-slate-300">
              <span>Provider:</span>
              <strong className="text-white font-mono">NVIDIA Nemotron AI</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Model:</span>
              <strong className="text-white font-mono">nemotron-3-ultra-550b</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Security:</span>
              <span className="text-emerald-400 font-semibold font-mono">FastAPI `.env` Secured</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <span className="font-mono font-bold text-cyan-300 uppercase block">Real-time Web Research Engine</span>
            <div className="flex justify-between text-slate-300">
              <span>Provider:</span>
              <strong className="text-white font-mono">Tavily Research API</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Database:</span>
              <strong className="text-white font-mono">Supabase PostgreSQL</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Security:</span>
              <span className="text-emerald-400 font-semibold font-mono">Row Level Security (RLS)</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 space-y-1">
          <div className="font-bold">HireMate Platform Architecture:</div>
          <p className="text-slate-300 leading-relaxed">
            • Core AI reasoning (Resume ATS scoring, Question generation, Candidate answer evaluations, Roadmaps, Career Chatbot) routes through NVIDIA Nemotron.<br />
            • Real-time web evidence gathering and company hiring process research route through Tavily API.<br />
            • Global research cache and candidate activities are persisted in Supabase database (`company_research`, `research_activity`).
          </p>
        </div>
      </div>
    </div>
  );
};
