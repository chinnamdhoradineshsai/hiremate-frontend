import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Search, CheckCircle2, Sparkles, Clock, Play, FileText, Paperclip, RefreshCw } from 'lucide-react';
import { AICoreVisualizer } from '../components/3d/AICoreVisualizer';
import { apiService } from '../services/api';
import type { CompanyResearch } from '../types';
import SpecularButton from '../components/ui/SpecularButton';

interface InterviewPrepProps {
  onStartSession: (sessionId: string, isRepeatInterview?: boolean) => void;
}

export const InterviewPrepPage: React.FC<InterviewPrepProps> = ({ onStartSession }) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [mode, setMode] = useState('Standard');
  const [jd, setJd] = useState('');
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | undefined>(undefined);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const [isResearching, setIsResearching] = useState(false);
  const [researchStep, setResearchStep] = useState(0);
  const [researchData, setResearchData] = useState<CompanyResearch | null>(null);
  const [isRepeat, setIsRepeat] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Launch session progress tracking
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchStep, setLaunchStep] = useState(0);
  // 0 = idle, 1 = loading research cache, 2 = generating questions, 3 = saving session, 4 = ready

  const steps = [
    `Analyzing candidate profile & target company '${company}'...`,
    `Fetching interview process stages...`,
    `Gathering publicly reported candidate interview experiences...`,
    `Identifying core technical topics & database questions...`,
    `Checking Question Vault for candidate deduplication...`,
    `Synthesizing multi-round interview structure...`
  ];

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setResumeFile(selectedFile);
      setUploadStatus('Uploading resume...');

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('target_company', company);
        formData.append('target_role', role);

        const atsRes = await apiService.analyzeResume(formData);
        if (atsRes && atsRes.resume_id) {
          setResumeId(atsRes.resume_id);
          setUploadStatus(`Attached: ${selectedFile.name} (ATS: ${atsRes.overall_score}%)`);
        } else {
          setUploadStatus(`Attached: ${selectedFile.name}`);
        }
      } catch (err: any) {
        setUploadStatus(`Error: ${err.message}`);
      }
    }
  };

  const handlePrepare = async () => {
    setIsResearching(true);
    setErrorMsg(null);
    setResearchStep(0);

    const interval = setInterval(() => {
      setResearchStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 650);

    try {
      const researchRes = await apiService.fetchResearch(company, role);
      setTimeout(() => {
        clearInterval(interval);
        setResearchData(researchRes);
        setIsResearching(false);
      }, 3000);
    } catch (err: any) {
      clearInterval(interval);
      setIsResearching(false);
      setErrorMsg(err.message || 'Company research failed.');
    }
  };

  const handleLaunchSession = async () => {
    setIsLaunching(true);
    setLaunchStep(1); // Step 1: Loading strategy
    setErrorMsg(null);
    try {
      setLaunchStep(2); // Step 2: Generating questions
      const sessionRes = await apiService.prepareInterview(company, role, mode, jd, resumeId);
      setLaunchStep(3); // Step 3: Saving session
      if (sessionRes && sessionRes.session_id) {
        if (typeof sessionRes.total_questions === 'number' && sessionRes.total_questions === 0) {
          setIsLaunching(false);
          setLaunchStep(0);
          setErrorMsg('Unable to generate interview questions. Please click Retry.');
          return;
        }
        setLaunchStep(4); // Step 4: Ready
        // Short pause so the candidate sees the "ready" state
        await new Promise((r) => setTimeout(r, 400));
        onStartSession(sessionRes.session_id, isRepeat);
      } else {
        setIsLaunching(false);
        setLaunchStep(0);
        setErrorMsg('Could not prepare interview session. Please try again.');
      }
    } catch (err: any) {
      setIsLaunching(false);
      setLaunchStep(0);
      setErrorMsg(err.message || 'Could not prepare interview session. Please retry.');
    }
  };

  const launchSteps = [
    { label: 'Loading company interview strategy...' },
    { label: 'Generating AI questions for your profile...' },
    { label: 'Saving session to secure vault...' },
    { label: 'Ready — launching interview room!' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="eyebrow-pill mb-2">
          <span className="dot-cyan" />
          <span>Realistic Virtual Interview Room</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold font-display text-white flex items-center gap-3">
          <Video className="w-8 h-8 text-cyan-400" />
          AI Interview Simulator Setup
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Builds a research-driven interview process for your selected company and role.
        </p>
      </div>

      {errorMsg && (
        <div className="glass-panel p-6 border-red-500/40 bg-red-500/10 space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 text-red-400">
            <RefreshCw className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold text-white text-base">Preparation Error</h3>
              <p className="text-xs text-red-300">{errorMsg}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={handlePrepare}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-dark-900 shadow-md transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
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

      {!researchData && !isResearching && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto glass-panel p-8 space-y-6"
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
            <Search className="w-5 h-5 text-purple-400" />
            Target Interview Configuration
          </h2>

          <div className="space-y-4">
            {/* Resume Upload Card */}
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" /> Candidate Resume Attachment
                </label>
                {resumeFile && (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Attached
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleResumeChange}
                  className="hidden"
                  id="sim-resume-input"
                />
                <label
                  htmlFor="sim-resume-input"
                  className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-white font-semibold text-xs border border-purple-500/40 cursor-pointer flex items-center gap-2 transition-all shadow-lg"
                >
                  <Paperclip className="w-4 h-4 text-cyan-400" />
                  {resumeFile ? "Change Resume" : "+ Attach Resume"}
                </label>

                <span className="text-xs text-slate-300 font-medium truncate">
                  {uploadStatus || "Attach PDF/DOCX for Resume Defense verification"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. TCS, Infosys, Google"
                className="w-full p-3.5 rounded-xl bg-dark-700/60 border border-white/10 text-white text-sm focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer, Systems Engineer"
                className="w-full p-3.5 rounded-xl bg-dark-700/60 border border-white/10 text-white text-sm focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Interview Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-dark-700/60 border border-white/10 text-white text-sm focus:border-cyan-400 outline-none"
              >
                <option value="Standard">Standard Interview (Realistic company simulation)</option>
                <option value="New Challenge">New Challenge (Fresh questions & targeted weak areas)</option>
                <option value="Hard Mode">Hard Mode (Deeper follow-ups & edge cases)</option>
                <option value="Weakness Training">Weakness Training (Focus on previously weak topics)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Job Description (Optional)</label>
              <textarea
                rows={3}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste job description or specific requirements..."
                className="w-full p-3 rounded-xl bg-dark-700/60 border border-white/10 text-white text-sm focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="repeat-toggle"
                checked={isRepeat}
                onChange={(e) => setIsRepeat(e.target.checked)}
                className="w-4 h-4 rounded bg-dark-700 border-white/20 text-cyan-500 focus:ring-0"
              />
              <label htmlFor="repeat-toggle" className="text-xs font-medium text-slate-300 cursor-pointer">
                Target fresh questions from previous interview history (Vault Check)
              </label>
            </div>

            <div className="pt-2">
              <SpecularButton
                size="lg"
                onClick={handlePrepare}
                tint="#06b6d4"
                tintOpacity={0.2}
                textColor="#ffffff"
                lineColor="#22d3ee"
                baseColor="#164e63"
                className="w-full py-4 shadow-xl"
              >
                <Sparkles className="w-5 h-5 text-cyan-300 mr-1" />
                START INTERVIEW PREPARATION
              </SpecularButton>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Research Progress Screen */}
      {isResearching && (
        <div className="glass-panel p-8 max-w-xl mx-auto space-y-6 text-center">
          <AICoreVisualizer state="research" size={200} />
          <h2 className="text-xl font-black text-white font-display">AI Research Engine Active</h2>

          <div className="space-y-3 text-left max-w-md mx-auto">
            {steps.map((st, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {i < researchStep ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : i === researchStep ? (
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
                )}
                <span className={i <= researchStep ? "text-slate-200 font-bold" : "text-slate-500"}>
                  {st}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Second Interview Experience Banner & Pre-flight Screen */}
      {researchData && !isResearching && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto glass-panel p-8 space-y-8"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AI Grounding & Vault Verification Complete
              </span>
              <h2 className="text-3xl font-black text-white font-display mt-2">SIMULATION READY</h2>
              <p className="text-sm text-slate-400">Target: <strong>{company}</strong> — <strong>{role}</strong> ({mode} Mode)</p>
            </div>
            <Clock className="w-8 h-8 text-cyan-400" />
          </div>

          {/* CRITICAL: Second Interview Experience Banner */}
          {isRepeat && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-dark-800 to-cyan-900/40 border border-purple-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-400 animate-spin-slow" /> NEW INTERVIEW DETECTED
                </span>
                <span className="text-xs font-mono text-purple-300 font-bold">Previous Score: 84%</span>
              </div>
              <h4 className="text-base font-bold text-white">Fresh questions generated from your previous performance.</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The AI Question Vault verified prior questions. This attempt specifically targets identified weak technical areas with brand-new scenarios.
              </p>
            </div>
          )}

          {/* Dynamic Evidence-Driven Stage Cards Breakdown */}
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(4, Math.max(1, (researchData.stage_configuration || researchData.interview_stages || []).length))} gap-4`}>
            {researchData.stage_configuration && researchData.stage_configuration.length > 0 ? (
              researchData.stage_configuration.map((stg, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-extrabold uppercase text-purple-400">STAGE {idx + 1}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${stg.status === 'official' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>
                      {stg.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase">{stg.name}</h3>
                  <p className="text-xs text-slate-400">{stg.type} round ({stg.question_count} questions)</p>
                </div>
              ))
            ) : (
              (researchData.interview_stages || []).map((stgName, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-cyan-400">STAGE {idx + 1}</span>
                  <h3 className="text-sm font-bold text-white">{stgName}</h3>
                  <p className="text-xs text-slate-400">Evidence-supported round</p>
                </div>
              ))
            )}
          </div>

          <div className="pt-2">
            {isLaunching ? (
              // Real progress screen shown while /interview/prepare is running
              <div className="p-6 rounded-2xl bg-dark-800/60 border border-emerald-500/20 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">Preparing Interview...</span>
                </div>
                <div className="space-y-3">
                  {launchSteps.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isDone = launchStep > stepNum;
                    const isActive = launchStep === stepNum;
                    return (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : isActive ? (
                          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
                        )}
                        <span className={isDone ? 'text-emerald-300 font-semibold' : isActive ? 'text-white font-bold' : 'text-slate-500'}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <SpecularButton
                size="lg"
                onClick={handleLaunchSession}
                tint="#10b981"
                tintOpacity={0.25}
                textColor="#ffffff"
                lineColor="#34d399"
                baseColor="#065f46"
                className="w-full py-4 shadow-2xl font-black text-lg"
              >
                <Play className="w-5 h-5 fill-current text-emerald-300 mr-2" />
                ENTER SIMULATOR ROOM
              </SpecularButton>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
