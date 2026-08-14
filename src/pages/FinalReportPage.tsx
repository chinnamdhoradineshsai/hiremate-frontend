import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ShieldAlert, BookOpen, ExternalLink, RotateCcw, ChevronDown, ChevronUp, Sparkles, Check, X, Compass, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { FinalReport } from '../types';

interface FinalReportProps {
  report: FinalReport;
  onRestart: () => void;
}

export const FinalReportPage: React.FC<FinalReportProps> = ({ report, onRestart }) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    if (report.overall_score >= 60) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [report]);

  const isDemo = report.is_demo || false;
  const questionsList = report.questions_with_answers || [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="eyebrow-pill mb-2">
            <span className={isDemo ? "dot-purple" : "dot-cyan"} />
            <span>{isDemo ? "FREE HIREMATE DEMO COMPLETE" : "Simulation Complete"}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black font-display text-white mt-1 flex items-center gap-3">
            {isDemo ? (
              <>
                <Sparkles className="w-8 h-8 text-amber-400" />
                DEMO RESULTS
              </>
            ) : (
              "Performance Intelligence Report"
            )}
          </h1>
          <p className="text-sm text-slate-400">Target: <strong>{report.company}</strong> — <strong>{report.role}</strong> (Mode: {isDemo ? "Demo" : "Standard"})</p>
        </div>

        <button
          onClick={onRestart}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-dark-800 hover:bg-dark-700 text-slate-200 border border-white/10 flex items-center gap-2 transition-all hover:scale-105"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" /> {isDemo ? "Return Home" : "Start New Simulation"}
        </button>
      </div>

      {/* Main Score & Readiness Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r="74" stroke="currentColor" strokeWidth="12" className="text-dark-700" fill="transparent" />
              <circle
                cx="88" cy="88" r="74" stroke="currentColor" strokeWidth="12"
                className={isDemo ? "text-amber-400" : "text-cyan-400"}
                fill="transparent"
                strokeDasharray={464.95}
                strokeDashoffset={464.95 * (1 - (report.overall_score || 0) / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black text-white font-mono">{report.overall_score}</span>
              <span className="text-xs text-slate-400 font-mono font-semibold">/ 100</span>
            </div>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-extrabold font-mono">
            {report.readiness_level}
          </div>
        </div>

        {/* Round & Dynamic Stage Scores Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {/* Overall Batch Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Total Questions</span>
              <div className="text-2xl font-black text-white font-mono">{report.total_questions_count || questionsList.length}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider">Answered</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">{report.answered_count ?? questionsList.filter(q => q.status === 'answered' || q.user_answer).length}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">Unanswered</span>
              <div className="text-2xl font-black text-amber-400 font-mono">{report.unanswered_count ?? questionsList.filter(q => q.status === 'unanswered' || !q.user_answer).length}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">Readiness</span>
              <div className="text-sm font-extrabold text-cyan-300 font-mono truncate">{report.readiness_level}</div>
            </div>
          </div>

          {/* Qualitative Subjective & Objective Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center">
              <div className="text-[9px] font-mono font-bold text-emerald-300 uppercase">Correct (MCQ)</div>
              <div className="text-lg font-black text-emerald-400 font-mono">{report.correct_answers_count ?? 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-center">
              <div className="text-[9px] font-mono font-bold text-rose-300 uppercase">Incorrect (MCQ)</div>
              <div className="text-lg font-black text-rose-400 font-mono">{report.incorrect_answers_count ?? 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-center">
              <div className="text-[9px] font-mono font-bold text-purple-300 uppercase">Strong Answers</div>
              <div className="text-lg font-black text-purple-300 font-mono">{report.strong_answers_count ?? 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-center">
              <div className="text-[9px] font-mono font-bold text-cyan-300 uppercase">Acceptable</div>
              <div className="text-lg font-black text-cyan-300 font-mono">{report.acceptable_answers_count ?? 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-center">
              <div className="text-[9px] font-mono font-bold text-amber-300 uppercase">Weak Answers</div>
              <div className="text-lg font-black text-amber-400 font-mono">{report.weak_answers_count ?? 0}</div>
            </div>
          </div>

          {/* Dynamic Stage Breakdown Cards */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Dynamic Stage Performance</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {report.stage_breakdown && report.stage_breakdown.length > 0 ? (
                report.stage_breakdown.map((st, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-dark-800/80 border border-white/10 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-white font-display truncate max-w-[130px]">{st.stage_name}</span>
                      <span className="text-xs font-black font-mono text-cyan-400">{st.stage_score}%</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                      <span>Answered:</span>
                      <strong className="text-slate-200">{st.answered_count} / {st.total_questions}</strong>
                    </div>
                  </div>
                ))
              ) : (
                Object.entries(report.round_scores).map(([r, score]) => (
                  <div key={r} className="p-4 rounded-2xl bg-dark-800/80 border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white font-display">{r} Round</span>
                      <span className="text-xs font-black font-mono text-cyan-400">{score}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* QUESTION-BY-QUESTION REVIEW (Requirements 12 & 13) */}
      {questionsList.length > 0 && (
        <div className="glass-panel p-6 space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Question-by-Question Detailed Review
            </h3>
            <p className="text-xs text-slate-400">Click any question to inspect your answer, evaluation, explanation, and improvement suggestions.</p>
          </div>

          <div className="space-y-3">
            {questionsList.map((item, idx) => {
              const isExpanded = expandedQuestion === idx;
              const isPassed = item.score >= 70;

              return (
                <div key={idx} className="glass-card border border-white/10 overflow-hidden transition-all">
                  <div
                    onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPassed ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}>
                        {isPassed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Question 0{idx + 1}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-purple-300 border border-white/10">{item.round_type}</span>
                          <span className="text-[10px] font-mono text-slate-400">{item.topic}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white font-display mt-0.5">{item.question_text}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-black font-mono ${isPassed ? "text-emerald-400" : "text-amber-400"}`}>
                        {item.score} / 100
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-5 border-t border-white/10 bg-dark-900/60 space-y-3 text-xs"
                    >
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-slate-400 uppercase">Your Answer:</span>
                        <div className="p-3 rounded-xl bg-white/5 text-slate-200 font-mono leading-relaxed">
                          {item.user_answer || "No response submitted"}
                        </div>
                      </div>

                      {item.correct_option && (
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-emerald-400 uppercase">Correct Option:</span>
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono">
                            {item.correct_option}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="font-mono font-bold text-purple-300 uppercase">Evaluation & Feedback:</span>
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-slate-200 leading-relaxed">
                          {item.feedback}
                        </div>
                      </div>

                      {item.suggestions && (
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-cyan-400 uppercase">How To Improve:</span>
                          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-slate-200 leading-relaxed">
                            {item.suggestions}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DEMO SKILL GAP & ROADMAP (Requirements 14 & 15) */}
      {isDemo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skill Gap */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-400" />
              Identified Skill Gaps (Demo Assessment)
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {(report.demo_skill_gap || report.weaknesses).map((gap, i) => (
                <li key={i} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">!</span> {gap}
                </li>
              ))}
            </ul>
          </div>

          {/* Demo Roadmap */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              Your Demo Action Roadmap
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {(report.demo_roadmap || [
                "1. Strengthen fundamental database indexing and SQL query tuning.",
                "2. Practice array subarray algorithms and Kadane's algorithm.",
                "3. Refine behavioral explanations using the STAR method structure."
              ]).map((step, i) => (
                <li key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                  <span className="text-amber-400 font-bold">→</span> {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      {!isDemo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Key Candidate Strengths
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {report.strengths.map((str, i) => (
                <li key={i} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> {str}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Areas for Technical Improvement
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {report.weaknesses.map((wk, i) => (
                <li key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                  <span className="text-amber-400 font-bold">!</span> {wk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Resume Vulnerabilities */}
      {report.resume_vulnerabilities && report.resume_vulnerabilities.length > 0 && (
        <div className="glass-panel p-6 space-y-3">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Resume Defense Vulnerabilities
          </h3>
          {report.resume_vulnerabilities.map((vuln, i) => (
            <p key={i} className="text-xs text-slate-300 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
              {vuln}
            </p>
          ))}
        </div>
      )}

      {/* Recommended Learning Resources */}
      {report.recommended_resources && report.recommended_resources.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Recommended Practice Resources
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.recommended_resources.map((res, i) => (
              <div key={i} className="glass-card p-5 space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-purple-300">{res.skill_name}</span>
                  <h4 className="text-sm font-bold text-white">{res.resource_title}</h4>
                  <p className="text-xs text-slate-400">{res.why_needed}</p>
                </div>

                <a
                  href={res.resource_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline pt-2 border-t border-white/5"
                >
                  <span>Access Material ({res.source_name})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
