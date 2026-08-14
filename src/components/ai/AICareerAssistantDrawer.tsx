import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Bot, Sparkles, RefreshCw } from 'lucide-react';
import { AICoreVisualizer } from '../3d/AICoreVisualizer';
import { apiService } from '../../services/api';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICareerAssistantDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'assistant',
      content: 'Welcome to HireMate AI Career Assistant! I am synchronized with your active resume, ATS evaluation, target company research, and historical interview performance. How can I boost your readiness today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([
    "How can I improve my ATS score?",
    "How should I answer database indexing questions?",
    "What are the top 3 weak areas I must improve?"
  ]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || loading) return;

    const newHistory = [...history, { role: 'user', content: text }];
    setHistory(newHistory);
    setInput('');
    setLoading(true);

    const res = await apiService.chatAssistant(text, newHistory);
    setHistory([...newHistory, { role: 'assistant', content: res.reply }]);
    if (res.suggested_actions && res.suggested_actions.length > 0) {
      setSuggested(res.suggested_actions);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-over Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-screen w-full max-w-md bg-dark-900/95 border-l border-white/10 shadow-2xl flex flex-col justify-between p-6 backdrop-blur-2xl"
          >
            {/* Header with AI Core Avatar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <AICoreVisualizer state={loading ? 'thinking' : 'idle'} size={54} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
                    HIREMATE <span className="grad-text">ASSISTANT</span>
                  </h2>
                  <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Context Active (Resume + ATS + Prep)
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History Messages */}
            <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
              {history.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 text-xs ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-purple-600/30 border border-purple-500/40 text-white font-medium' 
                      : 'bg-white/5 border border-white/10 text-slate-200'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span>HireMate AI Core analyzing context...</span>
                </div>
              )}
            </div>

            {/* Suggested Chips & Input */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex flex-wrap gap-1.5">
                {suggested.slice(0, 3).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 text-left transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="glass-panel p-1.5 rounded-2xl border border-white/15 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask HireMate AI anything..."
                  className="flex-1 bg-transparent px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold transition-all shadow-md hover:opacity-90"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
