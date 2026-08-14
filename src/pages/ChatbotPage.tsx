import React, { useState } from 'react';
import { Brain, Send, User, Bot } from 'lucide-react';
import { apiService } from '../services/api';

export const ChatbotPage: React.FC = () => {
  const [history, setHistory] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I am your HireMate AI Career Assistant. I am fully synchronized with your resume, ATS analysis, target company (TCS), target role (Software Engineer), and interview history. How can I guide your preparation today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([
    "Why is my ATS score at 87%?",
    "What should I learn first for Software Engineer?",
    "How can I prepare for TCS technical rounds?",
    "Give me an example of answering database indexing questions"
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
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 flex flex-col h-[calc(100vh-100px)]">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <Brain className="w-7 h-7 text-cyan-400" />
          AI Career Assistant
        </h1>
        <p className="text-xs text-slate-400">Contextually aware of your ATS reports, target company, role, and interview performance.</p>
      </div>

      {/* Chat Messages Window */}
      <div className="flex-1 glass-panel p-6 rounded-3xl border border-white/10 overflow-y-auto space-y-4">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 text-sm ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-xl p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-purple-600/30 border border-purple-500/40 text-white' 
                : 'bg-dark-700/60 border border-white/10 text-slate-200'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-400 italic">
            <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI Career Assistant is thinking...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {suggested.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSend(s)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="glass-panel p-2 rounded-2xl border border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about your ATS score, company research, or interview readiness..."
          className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-bold transition-all shadow-lg"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
