import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { AICoreVisualizer } from '../components/3d/AICoreVisualizer';
import { useAuth } from '../context/AuthContext';
import SpecularButton from '../components/ui/SpecularButton';

export const AdminLoginPage: React.FC<{
  onSuccess: () => void;
  onGoHome: () => void;
}> = ({ onSuccess, onGoHome }) => {
  const { loginAdmin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await loginAdmin(username, password);
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Access denied. Invalid admin credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex items-center justify-center relative overflow-hidden p-6 font-sans">
      {/* Background Atmosphere */}
      <div className="absolute w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-panel-gold p-8 flex flex-col items-center text-center relative z-10 space-y-6"
      >
        <div className="-mt-4">
          <AICoreVisualizer state="thinking" size={180} />
        </div>

        <div className="w-12 h-12 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl font-black font-display tracking-wider text-white">
            ADMIN PORTAL
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-widest">
            HireMate Developer & System Access
          </p>
        </div>

        {errorMsg && (
          <div className="w-full p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left font-mono">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Admin Username"
              className="w-full p-3 rounded-xl bg-dark-800 border border-white/15 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Password"
              className="w-full p-3 rounded-xl bg-dark-800 border border-white/15 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <SpecularButton
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full py-3.5"
              tint="#f59e0b"
              tintOpacity={0.2}
              textColor="#fbbf24"
              lineColor="#f59e0b"
              baseColor="#78350f"
            >
              {isSubmitting ? 'VALIDATING...' : 'ADMIN LOGIN'}
            </SpecularButton>
          </div>
        </form>

        <button
          onClick={onGoHome}
          className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1.5 pt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Main Landing Page
        </button>
      </motion.div>
    </div>
  );
};
