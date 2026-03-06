import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Simulation } from './components/Simulation';
import { Controls } from './components/Controls';
import { Info, Github, Sparkles } from 'lucide-react';

const PALETTES = {
  'Nebula': ['#4f46e5', '#9333ea', '#db2777', '#f472b6'],
  'Supernova': ['#ea580c', '#dc2626', '#facc15', '#fbbf24'],
  'Aurora': ['#059669', '#10b981', '#34d399', '#6ee7b7'],
  'Void': ['#1e293b', '#334155', '#475569', '#64748b'],
  'Cyber': ['#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'],
};

export default function App() {
  const [config, setConfig] = useState({
    particleCount: 600, // Reduced default for better perf
    gravity: 0.4,
    friction: 0.98,
    interactionMode: 'orbit' as const,
    showConnections: false,
    connectionDistance: 100,
    paletteName: 'Nebula',
  });

  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative w-full h-screen bg-[#05050a] overflow-hidden select-none">
      {/* Simulation Layer */}
      <Simulation 
        {...config} 
        colorPalette={PALETTES[config.paletteName as keyof typeof PALETTES]} 
      />

      {/* UI Overlay */}
      <div className="relative z-10 pointer-events-none w-full h-full flex flex-col justify-between p-6">
        {/* Header */}
        <header className="flex justify-between items-start">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="pointer-events-auto"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h1 className="text-lg font-bold tracking-tighter text-white/90">AETHERIA</h1>
            </div>
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20 ml-8">v1.0.2</p>
          </motion.div>

          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 pointer-events-auto"
          >
            <button className="glass p-2 rounded-lg hover:bg-white/10 transition-all">
              <Info className="w-4 h-4 text-white/50" />
            </button>
          </motion.div>
        </header>

        {/* Controls Component */}
        <div className="pointer-events-auto">
          <Controls config={config} setConfig={setConfig} palettes={PALETTES} />
        </div>

        {/* Footer / Status */}
        <footer className="flex justify-between items-end">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-mono text-[8px] text-white/20 space-y-0.5"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span>STABLE</span>
            </div>
            <div>BUFFER: {config.particleCount}</div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-[180px] text-right"
          >
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest leading-tight">
              Vector field manipulation active.
            </p>
          </motion.div>
        </footer>
      </div>

      {/* Intro Overlay */}
      {showIntro && (
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          onAnimationComplete={() => setShowIntro(false)}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold tracking-tighter mb-2">AETHERIA</h2>
            <div className="h-px w-12 bg-emerald-500 mx-auto mb-2" />
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/30">Initializing</p>
          </motion.div>
        </motion.div>
      )}

      {/* Custom Cursor */}
      <Cursor interactionMode={config.interactionMode} />
    </div>
  );
}

const Cursor = ({ interactionMode }: { interactionMode: string }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
      }
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[60] w-10 h-10 border border-white/10 rounded-full flex items-center justify-center will-change-transform"
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
    >
      <div className="w-0.5 h-0.5 bg-white rounded-full" />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: interactionMode === 'orbit' || interactionMode === 'vortex' ? 360 : 0
        }}
        transition={{ 
          scale: { repeat: Infinity, duration: 2 },
          rotate: { repeat: Infinity, duration: 4, ease: "linear" }
        }}
        className="absolute inset-0 border border-emerald-500/20 rounded-full"
      />
    </div>
  );
};
