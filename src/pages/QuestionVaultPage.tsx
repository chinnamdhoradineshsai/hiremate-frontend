import React, { useState, useEffect } from 'react';
import { HelpCircle, Search, Filter, Eye, X, Video, RefreshCw, XCircle } from 'lucide-react';
import { apiService } from '../services/api';

export const QuestionVaultPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRound, setSelectedRound] = useState('All');
  const [viewQuestion, setViewQuestion] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadVault = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.getQuestionVault();
      if (res && res.questions) {
        setQuestions(res.questions);
      } else {
        setQuestions([]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to retrieve question vault.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVault();
  }, []);

  const filtered = questions.filter((q) => {
    const matchSearch = (q.question_text || '').toLowerCase().includes(search.toLowerCase()) || (q.topic || '').toLowerCase().includes(search.toLowerCase());
    const matchRound = selectedRound === 'All' || q.round_type === selectedRound;
    return matchSearch && matchRound;
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center text-slate-400 font-mono text-xs animate-pulse">
        Loading Question Vault Intelligence...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-8 max-w-xl mx-auto space-y-4">
        <div className="glass-panel p-8 border-red-500/40 bg-red-500/10 text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white font-display">Vault Error</h2>
          <p className="text-xs text-red-300">{errorMsg}</p>
          <button
            onClick={loadVault}
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
          <span className="dot-cyan" />
          <span>Question Vault Intelligence</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold font-display text-white flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-cyan-400" />
          Question History Vault
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Historical repository of questions asked during your practice sessions. Prevents duplication in repeat interviews.
        </p>
      </div>

      {questions.length === 0 ? (
        <div className="glass-panel p-12 text-center max-w-2xl mx-auto space-y-4 border border-white/10">
          <HelpCircle className="w-16 h-16 text-cyan-400/60 mx-auto" />
          <h2 className="text-xl font-bold text-white font-display">No Questions Recorded Yet</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Complete an AI interview simulation to populate your question vault with practice evaluations and history.
          </p>
          <div className="pt-2">
            <button
              onClick={() => window.location.hash = '#interview'}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg inline-flex items-center gap-2"
            >
              <Video className="w-4 h-4" /> Start AI Interview
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Bar */}
          <div className="glass-panel p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions or topics..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-700/60 border border-white/10 text-white text-sm focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(e.target.value)}
                className="p-2.5 rounded-xl bg-dark-700/60 border border-white/10 text-white text-xs font-semibold focus:border-cyan-400 outline-none"
              >
                <option value="All">All Rounds</option>
                <option value="Aptitude">Aptitude</option>
                <option value="Technical">Technical</option>
                <option value="Coding">Coding</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>

          {/* Questions Table */}
          <div className="glass-panel border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/5 uppercase text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-4">Round & Topic</th>
                    <th className="p-4">Company & Role</th>
                    <th className="p-4">Question Text</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Score</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filtered.map((q) => (
                    <tr key={q.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-white block">{q.round_type}</span>
                        <span className="text-[11px] font-mono text-purple-300">{q.topic}</span>
                      </td>
                      <td className="p-4 text-slate-200">
                        {q.company} - {q.role}
                      </td>
                      <td className="p-4 text-slate-200 max-w-md">
                        "{q.question_text}"
                      </td>
                      <td className="p-4 font-mono font-bold text-cyan-400">
                        {q.source_type}
                      </td>
                      <td className="p-4 font-mono font-black text-emerald-400">
                        {q.score !== null && q.score !== undefined ? `${q.score}%` : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setViewQuestion(q)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 flex items-center gap-1.5 text-xs font-bold ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Answer Evaluation Detail Modal */}
      {viewQuestion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full space-y-4 border border-white/15 relative">
            <button
              onClick={() => setViewQuestion(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">{viewQuestion.round_type} Round ({viewQuestion.topic})</span>
            <h3 className="text-lg font-bold text-white font-display">"{viewQuestion.question_text}"</h3>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
              <span className="font-mono font-bold text-purple-300 uppercase">
                Score: {viewQuestion.score !== null && viewQuestion.score !== undefined ? `${viewQuestion.score}%` : 'Unanswered'}
              </span>
              <p className="text-slate-300">Target: {viewQuestion.company} — {viewQuestion.role}</p>
              <span className="text-[11px] text-slate-500 font-mono block">Date: {viewQuestion.date}</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewQuestion(null)}
                className="w-full py-3 rounded-xl bg-dark-700 hover:bg-dark-600 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
