import React, { useState, useEffect } from 'react';
import { GraduationCap, ExternalLink, FileText, Video, RefreshCw, XCircle } from 'lucide-react';
import { apiService } from '../services/api';
import type { LearningRoadmapItem } from '../types';

export const LearningRoadmapPage: React.FC = () => {
  const [items, setItems] = useState<LearningRoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadRoadmap = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await apiService.getLearningRoadmap();
      setItems(data || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to load learning roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const res = await apiService.toggleLearningStatus(id);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: res.status } : item))
      );
    } catch (e) {
      console.warn('Status toggle error', e);
    }
  };

  const weeks = [1, 2, 3, 4];

  if (loading) {
    return (
      <div className="p-8 flex justify-center text-slate-400 font-mono text-xs animate-pulse">
        Loading personalized learning roadmap...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-8 max-w-xl mx-auto space-y-4">
        <div className="glass-panel p-8 border-red-500/40 bg-red-500/10 text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white font-display">Roadmap Error</h2>
          <p className="text-xs text-red-300">{errorMsg}</p>
          <button
            onClick={loadRoadmap}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-red-500 hover:bg-red-400 text-white shadow-md transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="eyebrow-pill mb-2">
          <span className="dot-purple" />
          <span>Interactive Skill-Gap Progression</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold font-display text-white flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-emerald-400" />
          Personalized Career Roadmap
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Weekly skill targets tailored to identified ATS gaps and interview weaknesses.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="glass-panel p-12 text-center max-w-2xl mx-auto space-y-4 border border-white/10">
          <GraduationCap className="w-16 h-16 text-emerald-400/60 mx-auto" />
          <h2 className="text-xl font-bold text-white font-display">No Personalized Learning Roadmap Yet</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Complete your ATS analysis or interview simulation to generate your personalized learning roadmap.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => window.location.hash = '#resume'}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-dark-900 shadow-lg flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Analyze Resume
            </button>
            <button
              onClick={() => window.location.hash = '#interview'}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-dark-700 hover:bg-dark-600 text-cyan-300 border border-cyan-500/30 shadow-lg flex items-center gap-2"
            >
              <Video className="w-4 h-4" /> Start AI Interview
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {weeks.map((weekNum) => {
            const weekItems = items.filter((it) => it.roadmap_week === weekNum);
            if (weekItems.length === 0) return null;

            return (
              <div key={weekNum} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 font-mono font-extrabold text-xs">
                    WEEK 0{weekNum}
                  </span>
                  <div className="h-px bg-white/10 flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weekItems.map((item) => (
                    <div key={item.id} className="glass-card p-5 border border-white/10 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">{item.category}</span>
                          <button
                            onClick={() => handleToggle(item.id)}
                            className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded transition-all ${
                              item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {item.status}
                          </button>
                        </div>

                        <h3 className="text-base font-bold text-white font-display">{item.skill_name}</h3>
                        <p className="text-xs text-slate-300 font-medium">{item.resource_title}</p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <a
                          href={item.resource_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono font-bold text-amber-400 hover:underline flex items-center gap-1"
                        >
                          View Resource <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-[10px] text-slate-400 font-mono">{item.source_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
