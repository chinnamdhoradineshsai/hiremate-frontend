import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AICoreVisualizer } from '../3d/AICoreVisualizer';

export const IntroSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 300);
    const timer2 = setTimeout(() => setStage(2), 900);
    const timer3 = setTimeout(() => {
      onComplete();
    }, 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.97, filter: 'blur(10px)' }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-50 bg-dark-900 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Soft atmospheric background lighting */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] animate-pulse-glow" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex flex-col items-center text-center px-6 space-y-4">
        {/* 3D AI Core Forming */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-2"
        >
          <AICoreVisualizer state="thinking" size={180} interactive={false} />
        </motion.div>

        <AnimatePresence mode="wait">
          {stage >= 1 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-2"
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tight font-display text-white">
                HIRE<span className="grad-text">MATE</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base font-semibold tracking-wide max-w-md">
                Prepare Smarter. Interview Better. Get Hired.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onComplete}
          className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest font-mono font-semibold hover:underline"
        >
          Skip Intro →
        </button>
      </div>
    </motion.div>
  );
};
