import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Code, AlertCircle, ArrowRight, Sparkles, Send } from 'lucide-react';
import { AICoreVisualizer } from '../components/3d/AICoreVisualizer';
import { apiService } from '../services/api';
import type { QuestionItem } from '../types';

// ── Isolated Timer Component ────────────────────────────────────────────────
// Prevents the 1-second timer tick from re-rendering the entire InterviewRoomPage
const SessionTimer = memo(({ timerSeconds }: { timerSeconds: number }) => {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  const formatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono ${timerSeconds < 300 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-white/5 border-white/10 text-cyan-400'}`}>
      <Clock className="w-3.5 h-3.5" />
      <span>{formatted}</span>
    </div>
  );
});

interface InterviewRoomProps {
  sessionId: string;
  onFinish: (report: any) => void;
}

export const InterviewRoomPage: React.FC<InterviewRoomProps> = ({ sessionId, onFinish }) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  
  const [answerText, setAnswerText] = useState('');
  const [codeSubmission, setCodeSubmission] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [aiState, setAiState] = useState<'idle' | 'thinking' | 'speaking' | 'listening' | 'interview'>('speaking');
  const [evaluating, setEvaluating] = useState(false);
  const [currentEval, setCurrentEval] = useState<any>(null);

  const [roundTransition, setRoundTransition] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(3600);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // ── Microphone — fixed STT with proper interim/final handling ──────────
  const [micState, setMicState] = useState<'IDLE' | 'LISTENING' | 'COMPLETED' | 'ERROR'>('IDLE');
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  // Track committed final transcript and current interim display separately
  const finalTranscriptRef = useRef<string>('');
  const micStateRef = useRef<string>('IDLE');
  // Limited retry tracking for network errors
  const networkRetryCountRef = useRef<number>(0);
  const MAX_NETWORK_RETRIES = 2;

  // Keep micStateRef in sync for use inside recognition callbacks (avoids stale closures)
  useEffect(() => {
    micStateRef.current = micState;
  }, [micState]);

  // Initialize Web Speech API — single instance, proper interim/final handling
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    console.log('[STT] browserSupported=', !!SpeechRecognition);
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      
      console.log('[STT] recognitionCreated=true, language=en-US, continuous=true, interimResults=true');

      rec.onstart = () => {
        console.log('[STT] recognitionStarted=true');
        networkRetryCountRef.current = 0; // Reset retry count on successful start
      };

      rec.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcript;
          } else {
            interimChunk += transcript;
          }
        }
        
        // Commit final results exactly once
        if (finalChunk) {
          const separator = finalTranscriptRef.current ? ' ' : '';
          finalTranscriptRef.current += separator + finalChunk;
        }
        
        // Display: committed final text + current interim (interim is temporary, replaced each event)
        const displayText = finalTranscriptRef.current + (interimChunk ? ' ' + interimChunk : '');
        setAnswerText(displayText.trim());
        
        // Stay in LISTENING state while mic is active — don't set COMPLETED on every result
      };

      rec.onerror = (event: any) => {
        console.warn('[STT] error=', event.error);
        if (event.error === 'no-speech' || event.error === 'aborted') {
          // Ignore transient pauses/aborts — do not set error state
          return;
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicState('ERROR');
          setMicErrorMessage('Microphone access is blocked by your browser. Please click the lock/mic icon in your address bar and allow microphone permissions.');
          return;
        }
        if (event.error === 'network') {
          // Limited retry for network errors — don't loop forever
          if (networkRetryCountRef.current < MAX_NETWORK_RETRIES) {
            networkRetryCountRef.current++;
            console.log(`[STT] network error — retry attempt ${networkRetryCountRef.current}/${MAX_NETWORK_RETRIES}`);
            setTimeout(() => {
              if (micStateRef.current === 'LISTENING' && recognitionRef.current) {
                try { recognitionRef.current.start(); } catch (e) { /* already running or failed */ }
              }
            }, 500);
            return;
          }
          // Max retries exhausted
          console.warn('[STT] network error — max retries exhausted');
        }
        setMicState('ERROR');
        setMicErrorMessage(`Microphone error (${event.error}). Please type your response.`);
      };

      rec.onend = () => {
        // Only transition to COMPLETED if we were actively listening
        // (not if we were already in ERROR or IDLE)
        if (micStateRef.current === 'LISTENING') {
          setMicState(finalTranscriptRef.current ? 'COMPLETED' : 'IDLE');
        }
      };

      recognitionRef.current = rec;
    } else {
      console.warn('[STT] browserSupported=false');
      setMicErrorMessage('Speech recognition is not supported in this browser. Please type your answer.');
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []); // run once

  // Reset mic state when question changes
  useEffect(() => {
    setMicState('IDLE');
    setMicErrorMessage(null);
    finalTranscriptRef.current = '';
    networkRetryCountRef.current = 0;
  }, [currentIndex]);

  // Toggle mic
  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      setMicState('ERROR');
      setMicErrorMessage('Speech recognition is not supported in this browser. Please type your answer.');
      return;
    }
    if (micState === 'LISTENING') {
      try { recognitionRef.current.stop(); } catch (e) {}
      setMicState(answerText ? 'COMPLETED' : 'IDLE');
    } else {
      try {
        // Sync the finalTranscriptRef with any existing text (user may have typed)
        finalTranscriptRef.current = answerText;
        networkRetryCountRef.current = 0;
        setMicState('LISTENING');
        setMicErrorMessage(null);
        recognitionRef.current.start();
      } catch (e) {
        console.warn('[STT] start error:', e);
        setMicState('ERROR');
        setMicErrorMessage('Microphone access blocked or busy. Please type your answer.');
      }
    }
  };

  // Stop mic (used by timer expiry + question advance)
  const stopMic = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setMicState('IDLE');
    setAiState('idle');
  }, []);

  // Cancel TTS + stop mic when question changes or unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      stopMic();
    };
  }, [currentIndex, stopMic]);
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await apiService.getInterviewSession(sessionId);
        if (data) {
          setSessionInfo(data.session);
          const loadedQs = data.questions || [];
          setQuestions(loadedQs);

          // [QUESTION DEBUG] — verify backend uniqueness in browser console
          loadedQs.forEach((q: QuestionItem, idx: number) => {
            console.log(`[QUESTION DEBUG] index=${idx} question_id=${q.id} question_text_preview=${q.question_text?.slice(0, 60)!} stage=${(q as any).current_stage_name || (q as any).stage_name || q.round_type}`);
          });

          if (loadedQs[0]?.code_template) {
            setCodeSubmission(loadedQs[0].code_template);
          }
        }
      } catch (e) {
        console.warn('[Load Session Error]:', e);
      } finally {
        setSessionLoaded(true);
      }
    };
    loadSession();

    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId]);

  // Session-level 60-minute timer expiry handler
  useEffect(() => {
    if (timerSeconds <= 0 && !isTimeExpired && !isFinishing && sessionId) {
      setIsTimeExpired(true);
      setIsFinishing(true);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      stopMic();

      apiService.finishInterview(sessionId).then((report) => {
        onFinish(report);
      }).catch((err) => {
        console.warn('[Timer Expiry Finish Warning]:', err);
      });
    }
  }, [timerSeconds, isTimeExpired, isFinishing, sessionId, onFinish, stopMic]);

  const currentQ = questions[currentIndex];




  const [isReadyForFinalSubmit, setIsReadyForFinalSubmit] = useState(false);
  const [isEvaluatingBatch, setIsEvaluatingBatch] = useState(false);
  const [batchEvalError, setBatchEvalError] = useState<string | null>(null);

  const [evalError, setEvalError] = useState<string | null>(null);

  // Fast instant answer save (No AI evaluation call per question)
  const handleSubmitAnswer = async () => {
    if (!currentQ || isTimeExpired || isReadyForFinalSubmit) return;
    setEvaluating(true);
    setEvalError(null);

    try {
      await apiService.submitAnswer(
        currentQ.id,
        answerText,
        codeSubmission,
        selectedOption !== null ? selectedOption : undefined
      );

      setEvaluating(false);
      // Immediately advance to next question
      await handleNextQuestion();
    } catch (err: any) {
      setEvaluating(false);
      setAiState('idle');
      setEvalError(err.message || 'Saving answer failed. Please click Retry.');
    }
  };

  const handleNextQuestion = async () => {
    if (isTimeExpired) return;
    setAnswerText('');
    setSelectedOption(null);
    setCodeSubmission('');
    setEvalError(null);

    stopMic();

    const nextIdx = currentIndex + 1;

    // Check if another pre-generated question exists locally
    if (nextIdx < questions.length) {
      const nextQ = questions[nextIdx];
      if (currentQ && (nextQ.round_type !== currentQ.round_type || (nextQ.current_stage_name && nextQ.current_stage_name !== currentQ.current_stage_name))) {
        setRoundTransition(nextQ.current_stage_name || nextQ.round_type);
        setTimeout(() => setRoundTransition(null), 2400);
      }
      if (nextQ.code_template) {
        setCodeSubmission(nextQ.code_template);
      }
      setCurrentIndex(nextIdx);
      setAiState('speaking');
      return;
    }

    // Call dynamic backend stage-aware next-question endpoint
    try {
      setAiState('thinking');
      const adaptiveQ = await apiService.generateNextAdaptiveQuestion(sessionId);

      if (adaptiveQ && (adaptiveQ.interview_completed || !adaptiveQ.question_text)) {
        // All dynamic stages completed -> Prompt for Final Batch Evaluation
        setIsReadyForFinalSubmit(true);
        setAiState('idle');
        return;
      }

      if (adaptiveQ && adaptiveQ.id && adaptiveQ.question_text) {
        if (currentQ && (adaptiveQ.round_type !== currentQ.round_type || (adaptiveQ.current_stage_name && adaptiveQ.current_stage_name !== currentQ.current_stage_name))) {
          setRoundTransition(adaptiveQ.current_stage_name || adaptiveQ.round_type);
          setTimeout(() => setRoundTransition(null), 2400);
        }
        if (adaptiveQ.code_template) {
          setCodeSubmission(adaptiveQ.code_template);
        }
        setQuestions((prev) => [...prev, adaptiveQ]);
        setCurrentIndex(nextIdx);
        setAiState('speaking');
        return;
      }
    } catch (err: any) {
      console.warn("[Adaptive Question Fetch Warning]:", err);
    }

    // Completion trigger if end of stage sequence reached
    setIsReadyForFinalSubmit(true);
    setAiState('idle');
  };

  // Explicit Candidate Trigger for Batch AI Evaluation
  const handleTriggerBatchEvaluation = async () => {
    setIsEvaluatingBatch(true);
    setBatchEvalError(null);
    try {
      const finalReport = await apiService.finishInterview(sessionId);
      setIsEvaluatingBatch(false);
      onFinish(finalReport);
    } catch (err: any) {
      setIsEvaluatingBatch(false);
      setBatchEvalError(err.message || 'Batch AI evaluation failed. Please click Retry.');
    }
  };

  if (isReadyForFinalSubmit || isTimeExpired) {
    const answeredCount = questions.filter(q => q.answered || q.user_answer || q.code_template).length;
    const unansweredCount = Math.max(0, questions.length - answeredCount);

    return (
      <div className="min-h-screen bg-dark-900 text-slate-100 p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-2xl w-full border border-purple-500/30 space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white font-display uppercase tracking-wider">
              {isTimeExpired ? "INTERVIEW TIME COMPLETED" : "INTERVIEW STAGES COMPLETED"}
            </h1>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              You have completed all dynamically generated interview stages for <strong className="text-purple-300">{sessionInfo?.company || 'Target Company'}</strong> ({sessionInfo?.role || 'Role'}).
            </p>
          </div>

          {/* Stats Summary Card */}
          <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 font-mono text-center">
            <div className="space-y-1">
              <div className="text-2xl font-black text-white">{questions.length}</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Questions</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-emerald-400">{answeredCount}</div>
              <div className="text-[11px] text-emerald-400/80 uppercase tracking-wider">Answered</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-amber-400">{unansweredCount}</div>
              <div className="text-[11px] text-amber-400/80 uppercase tracking-wider">Unanswered</div>
            </div>
          </div>

          {batchEvalError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 space-y-2 text-left">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>Evaluation Error: {batchEvalError}</span>
              </div>
              <p>Your answers are saved. Click 'Submit All Answers for AI Evaluation' to retry synthesizing your report.</p>
            </div>
          )}

          {/* Explicit Candidate Trigger Button */}
          <button
            onClick={handleTriggerBatchEvaluation}
            disabled={isEvaluatingBatch}
            className="w-full py-5 rounded-2xl font-black text-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white shadow-2xl shadow-purple-600/30 flex items-center justify-center gap-3 transition-all"
          >
            {isEvaluatingBatch ? (
              <>
                <AICoreVisualizer state="thinking" size={32} />
                <span>Evaluating Entire Interview across All Stages with AI...</span>
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                <span>Submit All Answers for AI Evaluation</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    if (sessionLoaded && questions.length === 0) {
      return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[65vh] space-y-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 animate-bounce" />
          <h2 className="text-xl font-bold text-white font-display">No Questions Loaded</h2>
          <p className="text-slate-400 text-sm max-w-md">
            The interview session has no questions initialized. Please return to the setup page and click Retry.
          </p>
          <button
            onClick={() => window.location.hash = '#prep'}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold text-sm transition-all"
          >
            Return to Setup & Retry
          </button>
        </div>
      );
    }

    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[65vh]">
        <AICoreVisualizer state="thinking" size={200} />
        <p className="text-slate-400 font-mono text-xs animate-pulse mt-4">Initializing HireMate AI Virtual Interview Room...</p>
      </div>
    );
  }

  const getRoundBadge = (round: string) => {
    switch (round) {
      case 'Aptitude': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Technical': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Coding': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  const isAdaptiveQuestion = Boolean(
    currentQ.source_type &&
    (currentQ.source_type.includes('Adaptive') || currentQ.source_type.includes('Follow-up'))
  );

  const isCodingQuestion = Boolean(currentQ.round_type === 'Coding' || currentQ.code_template);
  const isMcqQuestion = Boolean(currentQ.options && currentQ.options.length > 0);

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 p-4 md:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* 60-Minute Session Timer Expiry Modal */}
      <AnimatePresence>
        {isTimeExpired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 text-center"
          >
            <div className="glass-panel p-8 rounded-3xl max-w-md border border-amber-500/40 space-y-4 shadow-2xl">
              <Clock className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
              <h2 className="text-2xl font-black text-white font-display uppercase tracking-wider">
                INTERVIEW TIME COMPLETED
              </h2>
              <p className="text-slate-300 text-sm">
                The 60-minute total interview timer has completed. Preserving submitted answers and generating your final performance report...
              </p>
              <div className="text-xs text-purple-300 font-mono">Processing final interview evaluation...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Round Transition Modal */}
      <AnimatePresence>
        {roundTransition && !isTimeExpired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-6 text-center"
          >
            <div className="glass-panel p-8 rounded-3xl max-w-md border border-cyan-500/40 space-y-4 shadow-2xl">
              <Sparkles className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
              <h2 className="text-2xl font-black text-white font-display uppercase tracking-wider">
                STAGE TRANSITION
              </h2>
              <p className="text-slate-300 text-sm">
                "Moving to stage: <strong className="text-cyan-300">{roundTransition}</strong>."
              </p>
              <div className="text-xs text-purple-300 font-mono">HireMate AI State Machine configuring next round...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Room Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            SIMULATION — {sessionInfo?.company || 'TCS'} ({sessionInfo?.role || 'Software Engineer'})
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className={`px-3.5 py-1 rounded-full border font-mono font-bold ${getRoundBadge(currentQ.round_type)}`}>
            STAGE: {currentQ.current_stage_name ? currentQ.current_stage_name.toUpperCase() : currentQ.round_type.toUpperCase()}
          </span>
          <span className="text-slate-400 font-mono">
            Question: <strong>{currentIndex + 1}</strong> of <strong>{questions.length}</strong>
          </span>
          <SessionTimer timerSeconds={timerSeconds} />
        </div>
      </div>

      {/* Main Interview Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        {/* Left Column: 3D AI Interviewer Visualizer */}
        <div className="lg:col-span-4 glass-panel p-6 flex flex-col items-center text-center space-y-4">
          <AICoreVisualizer state={aiState} size={230} interactive={true} />
          
          <div className="space-y-1">
            <div className="text-xs font-mono font-extrabold uppercase text-purple-300 tracking-wider">
              {evaluating ? "Analyzing your answer..." : `AI Interviewer (${aiState})`}
            </div>
            <h3 className="text-base font-bold text-white font-display">HireMate Intelligent AI Avatar</h3>
          </div>

          {/* Adaptive Experience Badges */}
          <div className="w-full space-y-2 pt-2">
            {isAdaptiveQuestion ? (
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Adaptive Question Engine Active</span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-semibold flex items-center justify-center gap-2">
                <span>Research Stage Question</span>
              </div>
            )}

            {isAdaptiveQuestion && (
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono font-medium">
                Difficulty Level: Adaptive ({currentQ.difficulty})
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Question Box & Clean Answer Area — key forces full remount on question change */}
        <div key={currentQ.id} className="lg:col-span-8 space-y-6">
          {/* Question Focus Box */}
          <div className="glass-panel p-8 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Topic: <strong className="text-purple-300">{currentQ.topic}</strong></span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-mono text-[10px] border border-purple-500/20 font-bold">
                  Q{currentIndex + 1}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 font-mono text-[10px] border border-white/10">{currentQ.source_type}</span>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-white font-display leading-relaxed">
              "{currentQ.question_text}"
            </h2>

            {currentQ.topic.includes('Resume') && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Exploring your project experience — Resume claim verification.</span>
              </div>
            )}
          </div>

          {/* Universal Clean Answer Area for ALL Dynamic Stages */}
          {!currentEval ? (
            <div className="glass-panel p-6 space-y-4">
              {/* Option A: MCQ Options (if options exist) */}
              {isMcqQuestion && (
                <div className="space-y-3">
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Select Response Option:</label>
                  {currentQ.options!.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(idx)}
                      disabled={isTimeExpired}
                      className={`w-full p-4 rounded-xl text-left text-sm font-semibold transition-all border ${
                        selectedOption === idx
                          ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-500/15'
                          : 'bg-dark-800/60 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Option B: Interactive Code Workspace (if coding stage) */}
              {isCodingQuestion && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Code className="w-4 h-4 text-cyan-400" /> Interactive Code Workspace
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">{currentQ.coding_constraints || "Python 3"}</span>
                  </div>

                  <textarea
                    rows={8}
                    value={codeSubmission}
                    disabled={isTimeExpired}
                    onChange={(e) => setCodeSubmission(e.target.value)}
                    className="w-full p-4 rounded-xl bg-dark-900 border border-white/15 text-emerald-400 font-mono text-sm focus:border-cyan-400 outline-none leading-relaxed"
                  />
                </div>
              )}

              {/* Universal Text & STT Voice Answer Area (for ALL dynamic stages) */}
              {!isMcqQuestion && !isCodingQuestion && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Candidate Response:</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const utterance = new SpeechSynthesisUtterance(currentQ.question_text);
                            utterance.rate = 1.0;
                            window.speechSynthesis.speak(utterance);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold hover:bg-amber-500/30 transition-all flex items-center gap-1"
                      >
                        🔊 Hear Question
                      </button>
                      <button
                        type="button"
                        onClick={toggleMicrophone}
                        disabled={isTimeExpired}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                          micState === 'LISTENING'
                            ? 'bg-rose-500/30 text-rose-200 border-rose-500/50 animate-pulse'
                            : micState === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30'
                        }`}
                      >
                        🎙️ {micState === 'LISTENING' ? 'Stop Microphone' : micState === 'COMPLETED' ? '🎙️ Speak More' : 'Speak Response (STT)'}
                      </button>
                    </div>
                  </div>

                  {/* Mic error message */}
                  {micErrorMessage && (
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-[11px] text-red-300 font-mono">
                      ⚠️ {micErrorMessage}
                    </div>
                  )}

                  {/* Answer textarea */}
                  <div className="relative">
                    <textarea
                      rows={5}
                      value={answerText}
                      disabled={isTimeExpired}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder={micState === 'LISTENING' ? '🎙️ Listening... speak now, words will appear here as you speak' : "Type or speak your answer. Click 'Submit Answer to AI' when ready..."}
                      className={`w-full p-4 rounded-2xl bg-dark-800/60 border text-sm outline-none leading-relaxed transition-all ${
                        micState === 'LISTENING'
                          ? 'border-rose-500/50 text-white focus:border-rose-400'
                          : 'border-white/10 text-white focus:border-purple-500'
                      }`}
                    />
                    {micState === 'LISTENING' && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                        <span className="text-[10px] font-mono font-bold text-rose-300">LIVE</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {evalError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Evaluation Error: {evalError}</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSubmitAnswer}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500 text-white"
                    >
                      Retry Answer Submission
                    </button>
                    <button
                      onClick={() => window.location.hash = '#settings'}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-dark-700 text-amber-300 border border-amber-500/30"
                    >
                      Switch AI Provider
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmitAnswer}
                disabled={evaluating || isTimeExpired}
                className="w-full py-4 rounded-xl font-extrabold text-base bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-5 h-5" />
                {evaluating ? "Analyzing your answer..." : "Submit Answer to AI"}
              </button>
            </div>
          ) : (
            /* Live Evaluation & Follow-up Display */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  AI Answer Evaluation
                </h3>
                <span className="text-sm font-black text-purple-300 font-mono px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                  Score: {currentEval.score} / 100
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">{currentEval.feedback}</p>
              
              <div className="p-3 rounded-xl bg-white/5 text-xs text-slate-300 italic">
                Recommendation: {currentEval.suggestions}
              </div>

              {currentEval.follow_up_question && (
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1">
                  <span className="font-mono font-extrabold uppercase text-cyan-400">Follow-up Question:</span>
                  <p className="text-slate-200 font-semibold">"{currentEval.follow_up_question}"</p>
                </div>
              )}

              <button
                onClick={handleNextQuestion}
                disabled={isTimeExpired}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-dark-900 shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                Continue to Next Question <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
