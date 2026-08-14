import React, { useState } from 'react';
import { Search, BookOpen, ExternalLink, RefreshCw, Building2, XCircle } from 'lucide-react';
import { apiService } from '../services/api';
import type { CompanyResearch } from '../types';

export const CompanyResearchPage: React.FC = () => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [data, setData] = useState<CompanyResearch | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchResearchData = async (comp: string, r: string) => {
    if (!comp.trim() || !r.trim()) {
      setErrorMsg('Please enter both target company and role to search.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.fetchResearch(comp, r);
      setData(res);
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to retrieve company research for ${comp}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="eyebrow-pill mb-2">
          <span className="dot-cyan" />
          <span>Source-Grounded Hiring Intelligence</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold font-display text-white flex items-center gap-3">
          <Search className="w-8 h-8 text-cyan-400" />
          Company Interview Research Center
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Target company hiring stages, publicly reported questions, role requirements, and source transparency classification.
        </p>
      </div>

      {/* Target Search Control */}
      <div className="glass-panel p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-300 mb-1">Target Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google, Microsoft, Amazon"
              className="w-full p-3 rounded-xl bg-dark-700/60 border border-white/10 text-white text-sm focus:border-cyan-400 outline-none"
            />
          </div>

          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-300 mb-1">Target Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer, Systems Architect"
              className="w-full p-3 rounded-xl bg-dark-700/60 border border-white/10 text-white text-sm focus:border-cyan-400 outline-none"
            />
          </div>

          <button
            onClick={() => fetchResearchData(company, role)}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg flex items-center justify-center gap-2 mt-4 sm:mt-5 transition-all hover:scale-105"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Research Company
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="glass-panel p-6 border-red-500/40 bg-red-500/10 space-y-4">
          <div className="flex items-center gap-3 text-red-400">
            <XCircle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold text-white text-base">Research Error</h3>
              <p className="text-xs text-red-300">{errorMsg}</p>
            </div>
          </div>
          <button
            onClick={() => fetchResearchData(company, role)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-400 text-white shadow-md transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-8 flex justify-center text-slate-400 font-mono text-xs animate-pulse">
          Gathering live company interview intelligence & web sources...
        </div>
      ) : data ? (
        <div className="space-y-8">
          {/* Header Summary Card */}
          <div className="glass-panel p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-cyan-400" />
                <div>
                  <h2 className="text-2xl font-black text-white font-display">{data.company}</h2>
                  <p className="text-sm text-slate-300 font-medium">{data.role}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                ✓ Verified Web Evidence
              </span>
              <span className="text-slate-400">{data.interview_stages.length} Interview Stages Identified</span>
            </div>
          </div>

          {/* Interview Stages & Topics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" /> Hiring Stages
              </h3>
              <div className="space-y-3">
                {data.interview_stages.map((stage, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200 font-medium flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{stage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" /> Core Technical Topics
              </h3>
              <div className="flex flex-wrap gap-2 pt-2">
                {data.common_topics.map((topic, idx) => (
                  <span key={idx} className="px-3 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sources Section */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-amber-400" /> Verified Search Sources & Evidence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.sources.map((src, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{src.title}</span>
                    <span className="font-mono text-[10px] text-cyan-400">{src.source_type}</span>
                  </div>
                  <a href={src.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-300 truncate block font-mono text-[11px]">
                    {src.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 text-center max-w-2xl mx-auto space-y-4 border border-white/10">
          <Building2 className="w-16 h-16 text-cyan-400/60 mx-auto" />
          <h2 className="text-xl font-bold text-white font-display">Target Company Search</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Enter a target company and role above to perform live web search intelligence and fetch authentic hiring process stages.
          </p>
        </div>
      )}
    </div>
  );
};
