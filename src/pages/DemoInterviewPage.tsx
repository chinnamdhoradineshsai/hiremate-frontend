import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, XCircle, Mic, ArrowRight, ArrowLeft, SkipForward,
  Sparkles, BookOpen, ChevronDown, ChevronUp, Check, X,
  LayoutDashboard, Clock, Home, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AICoreVisualizer } from '../components/3d/AICoreVisualizer';
import { staticDemoQuestions, type StaticDemoQuestion } from '../data/staticDemoQuestions';
import { DemoDashboardPage } from './DemoDashboardPage';
import SpecularButton from '../components/ui/SpecularButton';

interface DemoInterviewPageProps {
  onFinishDemo?: (summaryData: any) => void;
  onGoToDashboard?: (summaryData: any) => void;
  onGoHome?: () => void;
  onContinueGoogle?: () => void;
}

export interface DemoAnswerRecord {
  questionId: number;
  status: 'ATTEMPTED' | 'UNATTEMPTED';
  selectedOption?: number;
  isCorrect?: boolean;
  marks: number;
  userText?: string;
  usedVoice?: boolean;
  hasEvaluated?: boolean;
}

export const DemoInterviewPage: React.FC<DemoInterviewPageProps> = ({
  onFinishDemo,
  onGoToDashboard,
  onGoHome,
  onContinueGoogle
}) => {
  // Navigation & Round + Difficulty state
  const [activeRound, setActiveRound] = useState<'Aptitude' | 'Technical' | 'HR' | 'Dashboard'>('Aptitude');
  const [activeDifficulty, setActiveDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Question indices per round + difficulty tier
  const [tierIndices, setTierIndices] = useState<Record<string, number>>({
    'Aptitude-easy': 0, 'Aptitude-medium': 0, 'Aptitude-hard': 0,
    'Technical-easy': 0, 'Technical-medium': 0, 'Technical-hard': 0,
    'HR-easy': 0, 'HR-medium': 0, 'HR-hard': 0,
  });

  // Unsubmitted option selection state for current active question
  const [pendingOption, setPendingOption] = useState<number | null>(null);

  // Stored state for all 70 answers
  const [answers, setAnswers] = useState<Record<number, DemoAnswerRecord>>({});

  // 1-hour countdown timer (3600 seconds)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(3600);

  // Speech Recognition state
  const [micState, setMicState] = useState<'IDLE' | 'LISTENING' | 'COMPLETED' | 'ERROR'>('IDLE');
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [hrAnswerText, setHrAnswerText] = useState('');
  const recognitionRef = useRef<any>(null);
  // Track committed final transcript separately to prevent duplication
  const finalTranscriptRef = useRef<string>('');
  const micStateRef = useRef<string>('IDLE');

  // Keep micStateRef in sync (avoids stale closure in onend)
  useEffect(() => {
    micStateRef.current = micState;
  }, [micState]);

  // Submission & Review State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isDemoFinished, setIsDemoFinished] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'APTITUDE' | 'TECHNICAL' | 'HR' | 'UNATTEMPTED'>('ALL');

  // Filter questions for active round and selected difficulty level
  const currentTierKey = `${activeRound}-${activeDifficulty}`;
  const currentTierQs = staticDemoQuestions.filter(
    (q) => q.round_type === activeRound && q.difficulty === activeDifficulty
  );
  const currentTierIndex = tierIndices[currentTierKey] ?? 0;

  // Safe question resolution
  const currentQ: StaticDemoQuestion | undefined = currentTierQs[Math.max(0, Math.min(currentTierIndex, currentTierQs.length - 1))];
  const currentAns = currentQ ? answers[currentQ.id] : undefined;
  const isEvaluated = currentAns?.hasEvaluated ?? false;
  const activeSelectedOption = pendingOption !== null ? pendingOption : (currentAns?.selectedOption ?? null);

  // Initialize anonymous Demo session identifier (Requirement 4)
  useEffect(() => {
    let demoSessionId = localStorage.getItem('hiremate_demo_session_id');
    if (!demoSessionId) {
      demoSessionId = `demo_session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('hiremate_demo_session_id', demoSessionId);
    }
    localStorage.setItem('hiremate_demo_started', 'true');
  }, []);

  // Reset unsubmitted pending input when switching questions, rounds, or difficulty
  useEffect(() => {
    setPendingOption(null);
    if (currentQ) {
      setHrAnswerText(answers[currentQ.id]?.userText ?? '');
      finalTranscriptRef.current = answers[currentQ.id]?.userText ?? '';
    }
    setMicState('IDLE');
  }, [activeRound, activeDifficulty, currentTierIndex]);

  // Live 1-hour timer countdown
  useEffect(() => {
    if (isDemoFinished) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.setItem('hiremate_demo_completed', 'true');
          localStorage.setItem('hiremate_demo_completed_at', new Date().toISOString());
          localStorage.setItem('hiremate_demo_used', 'true');
          setIsDemoFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDemoFinished]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize Web Speech API — fixed: proper interim/final transcript handling
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

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
        setHrAnswerText(displayText.trim());

        // Stay in LISTENING state while mic is active — don't set COMPLETED on every result
      };

      rec.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicState('ERROR');
          setMicErrorMessage('Microphone access is blocked by your browser. Please click the lock/mic icon in your address bar and allow microphone permissions.');
          return;
        }
        setMicState('ERROR');
        setMicErrorMessage('Microphone or speech recognition error. Please type your answer instead.');
      };

      rec.onend = () => {
        // Use ref to avoid stale closure reading old micState
        if (micStateRef.current === 'LISTENING') {
          setMicState(finalTranscriptRef.current ? 'COMPLETED' : 'IDLE');
        }
      };

      recognitionRef.current = rec;
    } else {
      setMicErrorMessage('Speech recognition is not supported in this browser. You can type your answer below.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      setMicState('ERROR');
      setMicErrorMessage('Speech recognition is not supported in this browser. Please type your answer.');
      return;
    }

    if (micState === 'LISTENING') {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setMicState(hrAnswerText ? 'COMPLETED' : 'IDLE');
    } else {
      try {
        // Sync the finalTranscriptRef with any existing text (user may have typed/edited)
        finalTranscriptRef.current = hrAnswerText;
        setMicState('LISTENING');
        setMicErrorMessage(null);
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Mic start error:', e);
        setMicState('ERROR');
        setMicErrorMessage('Microphone access blocked or busy. Please type your answer.');
      }
    }
  };

  const handleSubmitObjectiveAnswer = () => {
    if (activeSelectedOption === null || !currentQ) return;
    const isCorrect = activeSelectedOption === currentQ.correctAnswerIndex;
    const marks = isCorrect ? 1 : 0;

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        questionId: currentQ.id,
        status: 'ATTEMPTED',
        selectedOption: activeSelectedOption,
        isCorrect,
        marks,
        hasEvaluated: true
      }
    }));
    setPendingOption(null);
  };

  const handleSubmitHrAnswer = () => {
    if (!currentQ) return;
    const text = hrAnswerText.trim() || 'No verbal response submitted';
    const usedVoice = micState === 'COMPLETED';

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        questionId: currentQ.id,
        status: 'ATTEMPTED',
        userText: text,
        marks: 1,
        usedVoice,
        hasEvaluated: true
      }
    }));
  };

  const handleSkipQuestion = () => {
    if (!currentQ) return;
    if (!answers[currentQ.id]) {
      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: {
          questionId: currentQ.id,
          status: 'UNATTEMPTED',
          marks: 0,
          hasEvaluated: false
        }
      }));
    }
    setPendingOption(null);
    setMicState('IDLE');

    if (currentTierIndex < currentTierQs.length - 1) {
      setTierIndices((prev) => ({ ...prev, [currentTierKey]: currentTierIndex + 1 }));
    }
  };

  const handleStepPrev = () => {
    setPendingOption(null);
    setMicState('IDLE');
    if (currentTierIndex > 0) {
      setTierIndices((prev) => ({ ...prev, [currentTierKey]: currentTierIndex - 1 }));
    }
  };

  const handleStepNext = () => {
    setPendingOption(null);
    setMicState('IDLE');
    if (currentTierIndex < currentTierQs.length - 1) {
      setTierIndices((prev) => ({ ...prev, [currentTierKey]: currentTierIndex + 1 }));
    }
  };

  const handleConfirmFinalSubmit = () => {
    setShowSubmitModal(false);
    localStorage.setItem('hiremate_demo_used', 'true');
    setIsDemoFinished(true);

    if (onFinishDemo) {
      onFinishDemo(getSummaryData());
    }

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  // Helper for metrics calculation
  const getRoundDifficultyStats = (round: 'Aptitude' | 'Technical' | 'HR', diff: 'easy' | 'medium' | 'hard') => {
    const qs = staticDemoQuestions.filter((q) => q.round_type === round && q.difficulty === diff);
    const attempted = qs.filter((q) => answers[q.id]?.status === 'ATTEMPTED');
    const correct = qs.filter((q) => answers[q.id]?.status === 'ATTEMPTED' && answers[q.id]?.isCorrect === true);
    const incorrect = qs.filter((q) => answers[q.id]?.status === 'ATTEMPTED' && answers[q.id]?.isCorrect === false);
    return {
      total: qs.length,
      attemptedCount: attempted.length,
      correctCount: correct.length,
      incorrectCount: incorrect.length,
      unansweredCount: qs.length - attempted.length,
      score: correct.length
    };
  };

  // Live total metrics - Memoized to prevent recalculation on every keystroke/timer tick
  const metrics = React.useMemo(() => {
    const aptEasy = getRoundDifficultyStats('Aptitude', 'easy');
    const aptMed = getRoundDifficultyStats('Aptitude', 'medium');
    const aptHard = getRoundDifficultyStats('Aptitude', 'hard');
    const aptScoreTotal = aptEasy.score + aptMed.score + aptHard.score;
    const aptAttemptedTotal = aptEasy.attemptedCount + aptMed.attemptedCount + aptHard.attemptedCount;

    const techEasy = getRoundDifficultyStats('Technical', 'easy');
    const techMed = getRoundDifficultyStats('Technical', 'medium');
    const techHard = getRoundDifficultyStats('Technical', 'hard');
    const techScoreTotal = techEasy.score + techMed.score + techHard.score;
    const techAttemptedTotal = techEasy.attemptedCount + techMed.attemptedCount + techHard.attemptedCount;

    const hrEasy = getRoundDifficultyStats('HR', 'easy');
    const hrMed = getRoundDifficultyStats('HR', 'medium');
    const hrHard = getRoundDifficultyStats('HR', 'hard');
    const hrAttemptedTotal = hrEasy.attemptedCount + hrMed.attemptedCount + hrHard.attemptedCount;

    const hrQs = staticDemoQuestions.filter((q) => q.round_type === 'HR');
    const hrVoiceCount = hrQs.filter((q) => answers[q.id]?.status === 'ATTEMPTED' && answers[q.id]?.usedVoice === true).length;
    const hrTextCount = hrQs.filter((q) => answers[q.id]?.status === 'ATTEMPTED' && !answers[q.id]?.usedVoice).length;

    const totalAttempted = aptAttemptedTotal + techAttemptedTotal + hrAttemptedTotal;
    const totalUnanswered = 70 - totalAttempted;
    const totalObjectiveScore = aptScoreTotal + techScoreTotal;

    return {
      aptEasy, aptMed, aptHard, aptScoreTotal, aptAttemptedTotal,
      techEasy, techMed, techHard, techScoreTotal, techAttemptedTotal,
      hrEasy, hrMed, hrHard, hrAttemptedTotal, hrVoiceCount, hrTextCount,
      totalAttempted, totalUnanswered, totalObjectiveScore
    };
  }, [answers]);

  const getSummaryData = () => ({
    overall_score: Math.round((metrics.totalObjectiveScore / 60) * 100),
    aptitudeScore: metrics.aptScoreTotal,
    technicalScore: metrics.techScoreTotal,
    totalObjectiveScore: metrics.totalObjectiveScore,
    hrCompletedCount: metrics.hrAttemptedTotal,
    hrVoiceCount: metrics.hrVoiceCount,
    hrTextCount: metrics.hrTextCount,
    totalAttempted: metrics.totalAttempted,
    totalUnanswered: metrics.totalUnanswered,
    aptEasy: metrics.aptEasy, aptMed: metrics.aptMed, aptHard: metrics.aptHard,
    techEasy: metrics.techEasy, techMed: metrics.techMed, techHard: metrics.techHard,
    hrEasy: metrics.hrEasy, hrMed: metrics.hrMed, hrHard: metrics.hrHard,
    answers
  });

  // 1. FINAL DEMO RESULTS VIEW
  if (isDemoFinished) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
        {/* Requirement 3: DEMO COMPLETION BANNER */}
        <div className="glass-panel-gold p-8 border border-amber-500/40 space-y-4 text-center flex flex-col items-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-1 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-black font-display text-white tracking-wider uppercase">
              DEMO COMPLETED
            </h2>
            <p className="text-slate-300 text-sm font-light leading-relaxed">
              You've completed your free HireMate Demo.
            </p>
            <p className="text-amber-300 text-xs font-mono font-bold pt-1 uppercase tracking-wider">
              Want to continue with the full AI-powered HireMate experience?
            </p>
          </div>

          <div className="pt-2">
            <SpecularButton
              size="lg"
              onClick={onContinueGoogle || onGoHome}
              tint="#ffffff"
              tintOpacity={0.9}
              textColor="#0f172a"
              lineColor="#ffffff"
              baseColor="#e2e8f0"
              className="py-4 px-8 shadow-2xl font-bold"
            >
              <svg className="w-4 h-4 shrink-0 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              CONTINUE WITH GOOGLE
            </SpecularButton>
          </div>
        </div>

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="eyebrow-pill mb-2">
              <span className="dot-purple" />
              <span>Static Demo Complete</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black font-display text-white mt-1 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-400" />
              DEMO RESULTS BY DIFFICULTY
            </h1>
            <p className="text-sm text-slate-400">Target: <strong>TCS</strong> — <strong>Software Engineer</strong> (70 Questions Static Assessment)</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onGoToDashboard && onGoToDashboard(getSummaryData())}
              className="px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-amber-500 to-amber-400 text-dark-900 shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-dark-900" />
              View Demo Dashboard
            </button>
            <button
              onClick={onGoHome}
              className="px-5 py-3 rounded-xl font-bold text-xs uppercase bg-dark-800 hover:bg-dark-700 text-slate-300 border border-white/10 flex items-center gap-2 transition-all"
            >
              <Home className="w-4 h-4 text-amber-400" />
              Return to Main Page
            </button>
          </div>
        </div>

        {/* Dynamic Round + Difficulty Breakdown Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Aptitude Card */}
          <div className="glass-panel p-6 space-y-4 border-l-4 border-l-amber-500">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">APTITUDE (30 Qs)</span>
              <span className="text-2xl font-black font-mono text-amber-400">{metrics.aptScoreTotal} / 30</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex justify-between">
                <span>🟢 Easy:</span>
                <span className="font-bold text-emerald-300">Attempted: {metrics.aptEasy.attemptedCount}/10 | Correct: {metrics.aptEasy.correctCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex justify-between">
                <span>🟡 Medium:</span>
                <span className="font-bold text-amber-300">Attempted: {metrics.aptMed.attemptedCount}/10 | Correct: {metrics.aptMed.correctCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex justify-between">
                <span>🔴 Hard:</span>
                <span className="font-bold text-rose-300">Attempted: {metrics.aptHard.attemptedCount}/10 | Correct: {metrics.aptHard.correctCount}</span>
              </div>
            </div>
          </div>

          {/* Technical Card */}
          <div className="glass-panel p-6 space-y-4 border-l-4 border-l-cyan-500">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">TECHNICAL (30 Qs)</span>
              <span className="text-2xl font-black font-mono text-cyan-400">{metrics.techScoreTotal} / 30</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex justify-between">
                <span>🟢 Easy:</span>
                <span className="font-bold text-emerald-300">Attempted: {metrics.techEasy.attemptedCount}/10 | Correct: {metrics.techEasy.correctCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex justify-between">
                <span>🟡 Medium:</span>
                <span className="font-bold text-amber-300">Attempted: {metrics.techMed.attemptedCount}/10 | Correct: {metrics.techMed.correctCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex justify-between">
                <span>🔴 Hard:</span>
                <span className="font-bold text-rose-300">Attempted: {metrics.techHard.attemptedCount}/10 | Correct: {metrics.techHard.correctCount}</span>
              </div>
            </div>
          </div>

          {/* HR Card */}
          <div className="glass-panel p-6 space-y-4 border-l-4 border-l-purple-500">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">HR ROUND (10 Qs)</span>
              <span className="text-2xl font-black font-mono text-purple-400">{metrics.hrAttemptedTotal} / 10</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex justify-between">
                <span>🟢 Easy:</span>
                <span className="font-bold text-emerald-300">Answered: {metrics.hrEasy.attemptedCount} / 3</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex justify-between">
                <span>🟡 Medium:</span>
                <span className="font-bold text-amber-300">Answered: {metrics.hrMed.attemptedCount} / 3</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex justify-between">
                <span>🔴 Hard:</span>
                <span className="font-bold text-rose-300">Answered: {metrics.hrHard.attemptedCount} / 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* 70-QUESTION REVIEW ACCORDION */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Complete 70-Question Detailed Review
              </h3>
              <p className="text-xs text-slate-400 mt-1">Review attempted answers, explanations, and difficulty levels.</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {(['ALL', 'APTITUDE', 'TECHNICAL', 'HR', 'UNATTEMPTED'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setReviewFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${
                    reviewFilter === f ? "bg-amber-500 text-dark-900 shadow-md" : "bg-white/5 hover:bg-white/10 text-slate-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {staticDemoQuestions
              .filter((q) => {
                if (reviewFilter === 'UNATTEMPTED') return answers[q.id]?.status !== 'ATTEMPTED';
                if (reviewFilter === 'ALL') return true;
                return q.round_type.toUpperCase() === reviewFilter;
              })
              .map((q) => {
                const ans = answers[q.id];
                const isExpanded = expandedReviewId === q.id;
                const isObjective = q.round_type !== 'HR';
                const isAttempted = ans?.status === 'ATTEMPTED';

                return (
                  <div key={q.id} className="glass-card border border-white/10 overflow-hidden transition-all">
                    <div
                      onClick={() => setExpandedReviewId(isExpanded ? null : q.id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          !isAttempted
                            ? "bg-slate-700 text-slate-400 border border-slate-600"
                            : isObjective
                            ? ans?.isCorrect
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        }`}>
                          {!isAttempted ? "—" : isObjective ? (ans?.isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />) : <Mic className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Q{q.id}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-amber-300 border border-white/10">{q.round_type}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              q.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-300' : q.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {q.difficulty}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{q.topic}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-white font-display mt-0.5">{q.question}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {!isAttempted ? (
                          <span className="text-xs font-mono text-slate-400">Not Attempted</span>
                        ) : isObjective ? (
                          <span className={`text-xs font-black font-mono ${ans?.isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                            {ans?.isCorrect ? "+1 Mark" : "0 Marks"}
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-purple-400">Captured</span>
                        )}
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-5 border-t border-white/10 bg-dark-900/60 space-y-3 text-xs font-mono"
                      >
                        {!isAttempted ? (
                          <div className="space-y-2">
                            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 font-sans">
                              Status: <strong className="text-amber-400">Not Attempted</strong> (Your Answer: None)
                            </div>
                            {q.options && q.correctAnswerIndex !== undefined && (
                              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                                Correct Answer: <strong>{q.correctAnswerLabel}: {q.options[q.correctAnswerIndex]}</strong>
                              </div>
                            )}
                            {q.explanation && (
                              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-slate-200 font-sans leading-relaxed">
                                <strong>Explanation:</strong> {q.explanation}
                              </div>
                            )}
                          </div>
                        ) : isObjective ? (
                          <>
                            <div className="space-y-1">
                              <span className="font-bold text-slate-400 uppercase">Your Answer:</span>
                              <div className={`p-3 rounded-xl border ${
                                ans?.isCorrect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                              }`}>
                                {ans?.selectedOption !== undefined && q.options ? `${["A","B","C","D"][ans.selectedOption]}: ${q.options[ans.selectedOption]}` : "Unanswered"}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="font-bold text-emerald-400 uppercase">Correct Answer:</span>
                              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                                {q.correctAnswerLabel}: {q.options ? q.options[q.correctAnswerIndex || 0] : ''}
                              </div>
                            </div>

                            {q.explanation && (
                              <div className="space-y-1">
                                <span className="font-bold text-cyan-400 uppercase">Explanation:</span>
                                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-slate-200 leading-relaxed font-sans">
                                  {q.explanation}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <span className="font-bold text-purple-300 uppercase">Your Verbal / Text Response:</span>
                              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-slate-200 font-sans leading-relaxed">
                                {ans?.userText || "No response recorded."}
                              </div>
                            </div>
                            <div className="text-[11px] text-slate-400 font-sans">
                              {ans?.usedVoice ? "🎙 Response captured via speech recognition." : "⌨ Response entered via text fallback."}
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  // 2. LIVE EMBEDDED DASHBOARD VIEW
  if (activeRound === 'Dashboard') {
    return (
      <div className="min-h-screen bg-dark-900 text-slate-100 font-sans">
        <header className="p-4 md:px-8 bg-dark-800 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveRound('Aptitude')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-dark-900 font-bold text-xs uppercase flex items-center gap-2 hover:bg-amber-400 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Questions
            </button>
            <span className="text-xs font-mono text-slate-400">Live Updating Demo Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-500 hover:bg-rose-400 text-white shadow-lg transition-all"
            >
              Submit Demo
            </button>
          </div>
        </header>

        <DemoDashboardPage
          demoSummary={getSummaryData()}
          onRetakeDemo={() => setActiveRound('Aptitude')}
          onGoHome={onGoHome}
        />
      </div>
    );
  }

  // 3. ACTIVE DEMO SIMULATION STAGE (Aptitude, Technical, HR)
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-dark-900 text-slate-100 flex items-center justify-center p-8">
        <div className="text-slate-400 font-mono text-xs">Loading question data...</div>
      </div>
    );
  }

  const isAptitude = activeRound === 'Aptitude';
  const isTechnical = activeRound === 'Technical';
  const isHR = activeRound === 'HR';

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans p-4 md:p-8">
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[160px] pointer-events-none" />

      {/* TOP STAGE HEADER */}
      <header className="space-y-4 border-b border-white/10 pb-4 mb-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-sm">
              H
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                STATIC DEMO EXAM DASHBOARD
              </div>
              <h2 className="text-sm font-bold text-white">Target: TCS — Software Engineer</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Timer pill */}
            <div className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>

            {/* Return to Main Page button */}
            <button
              onClick={onGoHome}
              className="px-4 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 hover:scale-105"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              Return to Main Page
            </button>

            {/* Submit Demo button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2 rounded-full font-bold text-xs tracking-wider uppercase bg-rose-500 hover:bg-rose-400 text-white shadow-lg transition-all hover:scale-105"
            >
              Submit Demo
            </button>
          </div>
        </div>

        {/* FREE ROUND NAVIGATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => {
                setPendingOption(null);
                setMicState('IDLE');
                setActiveRound('Aptitude');
              }}
              className={`px-4 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-2 ${
                activeRound === 'Aptitude'
                  ? "bg-amber-500 text-dark-900 shadow-lg shadow-amber-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
              }`}
            >
              <span>Aptitude</span>
              <span className="px-2 py-0.5 rounded-md bg-dark-900/40 text-[10px]">
                {metrics.aptAttemptedTotal} / 30
              </span>
            </button>

            <button
              onClick={() => {
                setPendingOption(null);
                setMicState('IDLE');
                setActiveRound('Technical');
              }}
              className={`px-4 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-2 ${
                activeRound === 'Technical'
                  ? "bg-cyan-500 text-dark-900 shadow-lg shadow-cyan-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
              }`}
            >
              <span>Technical</span>
              <span className="px-2 py-0.5 rounded-md bg-dark-900/40 text-[10px]">
                {metrics.techAttemptedTotal} / 30
              </span>
            </button>

            <button
              onClick={() => {
                setPendingOption(null);
                setMicState('IDLE');
                setActiveRound('HR');
              }}
              className={`px-4 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-2 ${
                activeRound === 'HR'
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
              }`}
            >
              <span>HR Round</span>
              <span className="px-2 py-0.5 rounded-md bg-dark-900/40 text-[10px]">
                {metrics.hrAttemptedTotal} / 10
              </span>
            </button>

            <button
              onClick={() => setActiveRound('Dashboard')}
              className="px-4 py-2 rounded-xl font-bold uppercase bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Dashboard</span>
            </button>
          </div>

          {/* Attempted summary indicator */}
          <div className="text-xs font-mono text-slate-400">
            Total Attempted: <strong className="text-amber-400">{metrics.totalAttempted}</strong> / 70 | Unanswered: <strong className="text-slate-300">{metrics.totalUnanswered}</strong>
          </div>
        </div>

        {/* DIFFICULTY LEVEL SELECTION BAR (Requirement 5) */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Choose Difficulty:</span>
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => {
                setPendingOption(null);
                setMicState('IDLE');
                setActiveDifficulty('easy');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeDifficulty === 'easy'
                  ? "bg-emerald-500 text-dark-900 shadow-md shadow-emerald-500/20"
                  : "bg-white/5 hover:bg-white/10 text-emerald-300 border border-emerald-500/20"
              }`}
            >
              <span>🟢 Easy</span>
              <span className="text-[10px] opacity-80">({isHR ? '3 Qs' : '10 Qs'})</span>
            </button>

            <button
              onClick={() => {
                setPendingOption(null);
                setMicState('IDLE');
                setActiveDifficulty('medium');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeDifficulty === 'medium'
                  ? "bg-amber-500 text-dark-900 shadow-md shadow-amber-500/20"
                  : "bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/20"
              }`}
            >
              <span>🟡 Medium</span>
              <span className="text-[10px] opacity-80">({isHR ? '3 Qs' : '10 Qs'})</span>
            </button>

            <button
              onClick={() => {
                setPendingOption(null);
                setMicState('IDLE');
                setActiveDifficulty('hard');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeDifficulty === 'hard'
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-white/5 hover:bg-white/10 text-rose-300 border border-rose-500/20"
              }`}
            >
              <span>🔴 Hard</span>
              <span className="text-[10px] opacity-80">({isHR ? '4 Qs' : '10 Qs'})</span>
            </button>
          </div>
        </div>
      </header>

      {/* QUESTION PALETTE GRID FOR ACTIVE ROUND + DIFFICULTY */}
      <div className="max-w-4xl mx-auto w-full mb-4 relative z-10">
        <div className="glass-panel p-3 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase shrink-0 mr-1">
            {activeDifficulty.toUpperCase()} Questions ({currentTierQs.length}):
          </span>
          {currentTierQs.map((q, idx) => {
            const isCurrent = currentTierIndex === idx;
            const ans = answers[q.id];
            const isAttempted = ans?.status === 'ATTEMPTED';

            let pillStyle = "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10";
            let badgeText = `${idx + 1}`;

            if (isAttempted) {
              if (q.round_type !== 'HR') {
                if (ans?.isCorrect) {
                  pillStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold";
                  badgeText = `${idx + 1}✓`;
                } else {
                  pillStyle = "bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold";
                  badgeText = `${idx + 1}✕`;
                }
              } else {
                pillStyle = "bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold";
                badgeText = `${idx + 1}✓`;
              }
            }

            if (isCurrent) {
              pillStyle += " ring-2 ring-amber-400 scale-105";
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  setPendingOption(null);
                  setMicState('IDLE');
                  setTierIndices((prev) => ({ ...prev, [currentTierKey]: idx }));
                }}
                className={`h-8 min-w-[34px] px-2 rounded-lg border text-xs font-mono flex items-center justify-center transition-all ${pillStyle}`}
              >
                {badgeText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card Stage */}
      <main className="max-w-4xl mx-auto w-full space-y-6 relative z-10 my-auto">
        {/* 3D Visualizer & Topic Tag */}
        <div className="flex flex-col items-center text-center space-y-2">
          <AICoreVisualizer state={isEvaluated ? "speaking" : "idle"} size={140} />
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full border text-[11px] font-mono font-bold uppercase ${
              activeDifficulty === 'easy' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : activeDifficulty === 'medium' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {activeDifficulty} level
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-mono">
              {currentQ.topic}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 md:p-8 space-y-6"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="font-bold text-amber-400 uppercase">
                {currentQ.round_type} ({activeDifficulty.toUpperCase()}) — Question #{currentTierIndex + 1} of {currentTierQs.length}
              </span>
              <span>Question ID: {currentQ.id}</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold font-display text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* OBJECTIVE MCQ OPTIONS */}
          {(isAptitude || isTechnical) && currentQ.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((optText, optIdx) => {
                const isSelected = activeSelectedOption === optIdx;
                const isCorrectChoice = optIdx === currentQ.correctAnswerIndex;
                const optLabel = ["A", "B", "C", "D"][optIdx];

                let optionStyle = "bg-white/5 border-white/10 hover:bg-white/10 text-slate-200";

                if (isEvaluated) {
                  if (isCorrectChoice) {
                    optionStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold";
                  } else if (isSelected && !isCorrectChoice) {
                    optionStyle = "bg-rose-500/20 border-rose-500/50 text-rose-300";
                  } else {
                    optionStyle = "bg-white/5 border-white/5 text-slate-500 opacity-50";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold shadow-lg shadow-amber-500/10";
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isEvaluated}
                    onClick={() => setPendingOption(optIdx)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${optionStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      {optLabel}
                    </span>
                    <span className="text-xs font-mono leading-relaxed">{optText}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* HR ROUND MICROPHONE & TEXT FALLBACK */}
          {isHR && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs space-y-1 font-mono">
                <div className="font-bold flex items-center gap-1.5 text-purple-300">
                  <Mic className="w-4 h-4" /> HR INTERVIEW GUIDANCE ({activeDifficulty.toUpperCase()} LEVEL)
                </div>
                <p className="text-slate-300 font-sans">Speak clearly and maintain a professional tone. Avoid very short answers and explain your thoughts thoroughly.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-dark-800/80 border border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleMicrophone}
                    className={`px-5 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all ${
                      micState === 'LISTENING'
                        ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30"
                        : micState === 'COMPLETED'
                        ? "bg-emerald-500 text-dark-900 font-black"
                        : "bg-purple-600 hover:bg-purple-500 text-white"
                    }`}
                  >
                    {micState === 'LISTENING' ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                        🔴 Listening...
                      </>
                    ) : micState === 'COMPLETED' ? (
                      <>
                        <Check className="w-4 h-4" />
                        ✓ Speech Captured
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        🎙 Start Speaking
                      </>
                    )}
                  </button>

                  <span className="text-xs font-mono text-slate-400">
                    {micState === 'LISTENING' && "Speak clearly into your microphone..."}
                    {micState === 'COMPLETED' && "You can review and edit your response below."}
                    {micState === 'IDLE' && "Click to start voice recording."}
                  </span>
                </div>

                {micErrorMessage && (
                  <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> {micErrorMessage}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-400 uppercase">Your Answer (Recognized Voice / Text Input):</label>
                <textarea
                  rows={4}
                  value={hrAnswerText}
                  onChange={(e) => setHrAnswerText(e.target.value)}
                  placeholder="Your spoken response will appear here automatically. You can also type or edit your answer..."
                  className="w-full p-4 rounded-xl bg-dark-900/90 border border-white/15 text-slate-100 text-xs font-mono focus:border-amber-400 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* EVALUATION FEEDBACK BOX */}
          {isEvaluated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3 pt-2"
            >
              {(isAptitude || isTechnical) && (
                <div className={`p-4 rounded-xl border ${
                  currentAns?.isCorrect
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                    : "bg-rose-500/15 border-rose-500/40 text-rose-300"
                }`}>
                  <div className="flex items-center gap-2 font-bold font-mono text-sm mb-2">
                    {currentAns?.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ✓ Correct (+1 Mark)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        ✕ Incorrect (0 Marks)
                      </>
                    )}
                  </div>

                  {!currentAns?.isCorrect && currentQ.options && activeSelectedOption !== null && activeSelectedOption >= 0 && activeSelectedOption < currentQ.options.length && (
                    <div className="text-xs font-mono space-y-1 mb-2">
                      <div><span className="text-slate-400">Your Answer:</span> {`${["A","B","C","D"][activeSelectedOption]}: ${currentQ.options[activeSelectedOption]}`}</div>
                      <div><span className="text-emerald-400 font-bold">Correct Answer:</span> {currentQ.correctAnswerLabel}: {currentQ.options[currentQ.correctAnswerIndex || 0]}</div>
                    </div>
                  )}

                  {currentQ.explanation && (
                    <div className="text-xs font-mono pt-2 border-t border-current/20 space-y-1">
                      <span className="font-bold uppercase text-slate-300">Explanation:</span>
                      <p className="text-slate-200 font-sans leading-relaxed">{currentQ.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {isHR && (
                <div className="p-4 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-200 space-y-2 text-xs font-mono">
                  <div className="font-bold flex items-center gap-2 text-purple-300">
                    <CheckCircle2 className="w-4 h-4" /> ANSWER CAPTURED
                  </div>
                  <p className="text-slate-300 font-sans">Your response has been recorded. Remember to keep answers relevant, provide specific examples, and speak clearly.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ACTION BUTTONS: PREV, SUBMIT ANSWER, SKIP, NEXT */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                disabled={currentTierIndex === 0}
                onClick={handleStepPrev}
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 border border-white/10 flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <button
                onClick={handleSkipQuestion}
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all"
              >
                <SkipForward className="w-3.5 h-3.5 text-amber-400" /> Skip Question
              </button>
            </div>

            <div className="flex items-center gap-2">
              {!isEvaluated ? (
                <button
                  disabled={(isAptitude || isTechnical) && activeSelectedOption === null}
                  onClick={isHR ? handleSubmitHrAnswer : handleSubmitObjectiveAnswer}
                  className="px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-dark-900 shadow-xl transition-all hover:scale-105"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleStepNext}
                  className="px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-400 text-dark-900 shadow-xl flex items-center gap-2 transition-all hover:scale-105"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* SUBMISSION CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-dark-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass-panel p-6 space-y-6 text-center border-amber-500/40"
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold font-display text-white">Submit Demo Assessment?</h3>
              <p className="text-xs text-slate-300 font-mono">You can submit your demo exam at any time and view your results.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Aptitude (Easy/Med/Hard):</span>
                <span className="text-amber-400 font-bold">{metrics.aptAttemptedTotal} / 30 Attempted</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Technical (Easy/Med/Hard):</span>
                <span className="text-cyan-400 font-bold">{metrics.techAttemptedTotal} / 30 Attempted</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">HR (Easy/Med/Hard):</span>
                <span className="text-purple-400 font-bold">{metrics.hrAttemptedTotal} / 10 Answered</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-sm">
                <span className="text-white">Total Completed:</span>
                <span className="text-emerald-400">{metrics.totalAttempted} Attempted ({metrics.totalUnanswered} Unanswered)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-xl font-bold text-xs uppercase bg-dark-800 hover:bg-dark-700 text-slate-300 border border-white/10 transition-all"
              >
                Continue Demo
              </button>
              <button
                onClick={handleConfirmFinalSubmit}
                className="flex-1 py-3 rounded-xl font-bold text-xs uppercase bg-rose-500 hover:bg-rose-400 text-white shadow-lg transition-all hover:scale-105"
              >
                Confirm & Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
