import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { AICoreVisualizer } from '../components/3d/AICoreVisualizer';
import { useAuth } from '../context/AuthContext';
import SpecularButton from '../components/ui/SpecularButton';

interface LoginPageProps {
  onSuccess?: () => void;
  onStartDemo?: () => void;
  onGoHome?: () => void;
  initialMode?: 'login' | 'signup';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onStartDemo,
  onGoHome,
  initialMode = 'login'
}) => {
  const { loginWithGoogle, isConfigured, syncError } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeError = errorMsg || syncError;

  const handleGoogleClick = async () => {
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex items-center justify-center relative overflow-hidden p-6 font-sans">
      {/* EOS AI Golden Background Atmosphere */}
      <div className="absolute w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel-gold p-8 flex flex-col items-center text-center relative z-10"
      >
        {/* EOS 3D Visualizer */}
        <div className="-mt-4 mb-2">
          <AICoreVisualizer state="thinking" size={200} />
        </div>

        <div className="w-10 h-10 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400 font-display font-bold text-sm mb-3">
          H
        </div>

        {mode === 'login' ? (
          <>
            <h1 className="text-2xl font-display font-light tracking-[0.15em] text-white">
              LOGIN
            </h1>
            <p className="text-slate-300 text-xs font-mono mt-1 mb-6">
              Continue to your HireMate account.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-display font-black tracking-[0.1em] text-white">
              CREATE YOUR HIREMATE ACCOUNT
            </h1>
            <p className="text-slate-300 text-xs font-mono mt-1 mb-6">
              Start your AI-powered interview preparation.
            </p>
          </>
        )}

        {!isConfigured && (
          <div className="w-full mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Supabase credentials not configured in frontend .env. Google OAuth requires Supabase setup.</span>
          </div>
        )}

        {activeError && (
          <div className="w-full mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-left">
            {activeError}
          </div>
        )}

        {/* Real Google OAuth Login SpecularButton (Requirements 5 & 6) */}
        <div className="w-full space-y-4">
          <SpecularButton
            size="lg"
            onClick={handleGoogleClick}
            tint="#ffffff"
            tintOpacity={0.9}
            textColor="#0f172a"
            lineColor="#ffffff"
            baseColor="#e2e8f0"
            className="w-full py-4 shadow-2xl font-bold"
          >
            <svg className="w-4 h-4 shrink-0 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </SpecularButton>

          {/* Mode Switcher */}
          <div className="pt-2 text-xs font-mono text-slate-300">
            {mode === 'login' ? (
              <div className="space-y-2">
                <span>Don't have a HireMate account?</span>
                <div>
                  <button
                    onClick={() => setMode('signup')}
                    className="font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider underline"
                  >
                    SIGN UP
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <span>Already have an account?</span>
                <div>
                  <button
                    onClick={() => setMode('login')}
                    className="font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider underline"
                  >
                    LOGIN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {onStartDemo && (
          <button
            onClick={onStartDemo}
            className="mt-4 text-xs font-mono text-amber-300 hover:text-amber-200 uppercase font-bold tracking-wider"
          >
            Try Free Demo Simulation →
          </button>
        )}

        {onGoHome && (
          <button
            onClick={onGoHome}
            className="mt-4 text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Main Landing Page
          </button>
        )}

        <div className="mt-6 text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Protected by HireMate Security Gateway.</span>
        </div>
      </motion.div>
    </div>
  );
};
