import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, Sparkles, BookOpen, AlertCircle, RefreshCw, ExternalLink, ShieldCheck, Check, AlertTriangle, XCircle } from 'lucide-react';
import { apiService } from '../services/api';
import type { ATSAnalysisData } from '../types';
import SpecularButton from '../components/ui/SpecularButton';

export const AtsPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jd, setJd] = useState('');
  const [rawText, setRawText] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [analysisData, setAnalysisData] = useState<ATSAnalysisData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const steps = [
    "Reading Resume",
    "Understanding Role",
    "Analyzing Skills",
    "Checking ATS Compatibility",
    "Finding Missing Keywords",
    "Finding Missing Skills",
    "Finding Learning Resources"
  ];

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const runAnalysis = async () => {
    if (!company.trim()) {
      setErrorMsg("Target Company is required. Please specify target company.");
      return;
    }
    if (!role.trim()) {
      setErrorMsg("Target Role is required. Please specify target role.");
      return;
    }
    if (!file && !rawText.trim()) {
      setErrorMsg("Resume is required. Please upload a PDF/DOCX file or paste raw resume text.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setStepIndex(0);

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 600);

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (rawText.trim()) {
      formData.append('raw_resume_text', rawText.trim());
    }
    formData.append('target_company', company.trim());
    formData.append('target_role', role.trim());
    formData.append('job_description', jd ? jd.trim() : '');

    try {
      const res = await apiService.analyzeResume(formData);
      setTimeout(() => {
        clearInterval(interval);
        setAnalysisData(res);
        setIsAnalyzing(false);
      }, 3000);
    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setErrorMsg(err.message || 'ATS Resume Analysis failed.');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="eyebrow-pill mb-2">
          <span className="dot-purple" />
          <span>Hybrid Deterministic + Semantic Engine</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold font-display text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-purple-400" />
          ATS Resume Compatibility Analyzer
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Deep structural compliance analysis, keyword matching, skill mapping, and instant rewriting recommendations.
        </p>
      </div>

      {errorMsg && (
        <div className="glass-panel p-6 border-red-500/40 bg-red-500/10 space-y-4">
          <div className="flex items-center gap-3 text-red-400">
            <XCircle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold text-white text-base">Analysis Error</h3>
              <p className="text-xs text-red-300">{errorMsg}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={runAnalysis}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-400 text-white shadow-md transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Analysis
            </button>

            <button
              onClick={() => window.location.hash = '#settings'}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-700 hover:bg-dark-600 text-amber-300 border border-amber-500/30 transition-all"
            >
              Try another AI provider
            </button>

            <button
              onClick={() => {
                window.location.hash = '#demo';
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-all"
            >
              Enter Demo Mode
            </button>
          </div>
        </div>
      )}

      {!analysisData && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Uploader Left */}
          <div className="lg:col-span-6 space-y-4">
            <label className="block text-sm font-bold text-white uppercase tracking-wider font-mono">1. Resume Document Upload</label>
            
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-3xl p-8 glass-panel flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.01]"
            >
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <span className="text-sm font-bold text-white">
                  {file ? file.name : "Drag & Drop Resume (PDF/DOCX) or Click to Browse"}
                </span>
                <span className="text-xs text-slate-400 mt-1">Maximum size 10MB</span>
              </label>
            </div>

            <div className="text-center text-xs text-slate-500 uppercase tracking-widest font-mono font-bold">OR Paste Resume Text</div>

            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw resume text here if uploading document is not preferred..."
              className="w-full p-4 rounded-2xl bg-dark-800/60 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
            />
          </div>

          {/* Target Role & Company Input */}
          <div className="lg:col-span-6 space-y-4">
            <label className="block text-sm font-bold text-white uppercase tracking-wider font-mono">2. Target Role & Company Specifications</label>

            <div className="glass-panel p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. TCS, Infosys, Google"
                  className="w-full p-3.5 rounded-xl bg-dark-700/60 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Software Engineer, Full Stack Developer"
                  className="w-full p-3.5 rounded-xl bg-dark-700/60 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Job Description (Optional)</label>
                <textarea
                  rows={3}
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste specific job requirements or role details..."
                  className="w-full p-3.5 rounded-xl bg-dark-700/60 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div className="pt-2">
                <SpecularButton
                  size="lg"
                  onClick={runAnalysis}
                  tint="#a855f7"
                  tintOpacity={0.2}
                  textColor="#ffffff"
                  lineColor="#c084fc"
                  baseColor="#581c87"
                  className="w-full py-4 shadow-xl"
                >
                  <Sparkles className="w-5 h-5 text-purple-300 mr-1" />
                  CHECK ATS SCORE & ANALYZE COMPATIBILITY
                </SpecularButton>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Multi-stage AI Analysis Screen */}
      {isAnalyzing && (
        <div className="glass-panel p-8 max-w-xl mx-auto space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto animate-spin-slow">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white font-display">AI ATS Analysis Stage</h2>

          <div className="space-y-3 text-left max-w-md mx-auto">
            {steps.map((st, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {i < stepIndex ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : i === stepIndex ? (
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
                )}
                <span className={i <= stepIndex ? "text-slate-200 font-bold" : "text-slate-500"}>
                  {st}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Screen */}
      {analysisData && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              ATS Compatibility Audit Active
            </span>
            <button
              onClick={() => setAnalysisData(null)}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-analyze Resume
            </button>
          </div>

          {/* Radial Visualization Score Gauge */}
          <div className="glass-panel p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="88" cy="88" r="74" stroke="currentColor" strokeWidth="12" className="text-dark-700" fill="transparent" />
                  <circle
                    cx="88" cy="88" r="74" stroke="currentColor" strokeWidth="12"
                    className="text-purple-500"
                    fill="transparent"
                    strokeDasharray={464.95}
                    strokeDashoffset={464.95 * (1 - analysisData.overall_score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black text-white font-mono">{analysisData.overall_score}</span>
                  <span className="text-xs text-slate-400 font-mono font-semibold">/ 100</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Overall score for <strong>{role}</strong> at <strong>{company}</strong>
              </p>
            </div>

            {/* Breakdown Charts */}
            <div className="lg:col-span-8 space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Category Score Breakdown</h3>
              
              {Object.entries(analysisData.breakdown).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300 capitalize">{key.replace('_', ' ')}</span>
                    <span className="text-purple-300 font-mono font-bold">{val}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-dark-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-1000"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Skill Gap Map */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Visual Skill Map Hierarchy
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-5 border-emerald-500/20 space-y-2">
                <div className="text-xs font-mono font-extrabold uppercase text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Strong Skills
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['Python', 'React', 'SQL', 'FastAPI', 'Git'].map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card p-5 border-amber-500/20 space-y-2">
                <div className="text-xs font-mono font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Weak Skills
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['DSA', 'System Design', 'PostgreSQL Query Tuning'].map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card p-5 border-rose-500/20 space-y-2">
                <div className="text-xs font-mono font-extrabold uppercase text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Missing Required Skills
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {analysisData.missing_skills.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-semibold">
                      {sk.skill_name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Missing Skills Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Detailed Skill Gap Recommendations ({analysisData.missing_skills.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisData.missing_skills.map((skill, idx) => (
                <div key={idx} className="glass-card p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-bold text-white">{skill.skill_name}</h4>
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {skill.importance} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{skill.why_it_matters}</p>
                  <div className="pt-2 text-xs text-purple-300 border-t border-white/5 font-medium">
                    💡 Action Item: {skill.how_to_improve}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wording Improvements */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Resume Wording & Bullet Improvements
            </h3>

            <div className="space-y-4">
              {analysisData.writing_improvements.map((item, i) => (
                <div key={i} className="glass-panel p-5 space-y-3">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{item.section}</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-1">
                      <div className="font-bold text-rose-400">Original Bullet:</div>
                      "{item.original}"
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 space-y-1">
                      <div className="font-bold text-emerald-400">AI Rewritten Wording:</div>
                      "{item.improved}"
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">Rationale: {item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Free Authoritative Learning Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Verified Free Learning Materials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisData.free_resources.map((res, i) => (
                <div key={i} className="glass-card p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-purple-300">{res.skill_name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded bg-white/5">{res.difficulty}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{res.resource_title}</h4>
                    <p className="text-xs text-slate-400">{res.why_needed}</p>
                  </div>

                  <a
                    href={res.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-3 border-t border-white/5"
                  >
                    <span>Source: {res.source_name}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
