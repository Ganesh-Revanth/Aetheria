import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings2, 
  Zap, 
  Wind, 
  Maximize2, 
  Palette, 
  MousePointer2,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Camera
} from 'lucide-react';

interface ControlsProps {
  config: {
    particleCount: number;
    gravity: number;
    friction: number;
    interactionMode: 'attract' | 'repel' | 'orbit' | 'vortex';
    showConnections: boolean;
    connectionDistance: number;
    paletteName: string;
  };
  setConfig: (config: any) => void;
  palettes: Record<string, string[]>;
}

export const Controls: React.FC<ControlsProps> = ({ config, setConfig, palettes }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const updateConfig = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  const modes = [
    { id: 'attract', label: 'Singularity', icon: Zap },
    { id: 'repel', label: 'Pulse', icon: Wind },
    { id: 'orbit', label: 'Stellar', icon: RefreshCw },
    { id: 'vortex', label: 'Maelstrom', icon: Maximize2 },
  ];

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex items-center gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="glass-dark p-4 rounded-2xl w-64 flex flex-col gap-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
                <h2 className="font-mono text-[9px] uppercase tracking-widest text-white/50">Config</h2>
              </div>
              <button 
                onClick={() => window.print()} 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-white/30" />
              </button>
            </div>

            {/* Mode Selector */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1.5">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => updateConfig('interactionMode', mode.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all border ${
                      config.interactionMode === mode.id 
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                        : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                    }`}
                  >
                    <mode.icon className="w-3 h-3" />
                    <span className="text-[10px] font-medium">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders - Compact */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[8px] uppercase text-white/30">Density</label>
                  <span className="font-mono text-[8px] text-emerald-400/70">{config.particleCount}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1200"
                  step="50"
                  value={config.particleCount}
                  onChange={(e) => updateConfig('particleCount', parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-0.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[8px] uppercase text-white/30">Gravity</label>
                  <span className="font-mono text-[8px] text-emerald-400/70">{config.gravity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="1.5"
                  step="0.05"
                  value={config.gravity}
                  onChange={(e) => updateConfig('gravity', parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-0.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Palette Selector */}
            <div className="flex items-center justify-between gap-2">
              <label className="font-mono text-[8px] uppercase text-white/30">Palette</label>
              <div className="flex gap-1.5">
                {Object.keys(palettes).map((name) => (
                  <button
                    key={name}
                    onClick={() => updateConfig('paletteName', name)}
                    className={`w-5 h-5 rounded-full border transition-all ${
                      config.paletteName === name ? 'border-white scale-110' : 'border-transparent opacity-40 hover:opacity-100'
                    }`}
                    style={{ background: `linear-gradient(45deg, ${palettes[name][0]}, ${palettes[name][1]})` }}
                  />
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[8px] font-mono uppercase text-white/30">Neural Links</span>
              <button
                onClick={() => updateConfig('showConnections', !config.showConnections)}
                className={`w-8 h-4 rounded-full transition-colors relative ${
                  config.showConnections ? 'bg-emerald-500' : 'bg-white/10'
                }`}
              >
                <motion.div
                  animate={{ x: config.showConnections ? 16 : 2 }}
                  className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass p-2 rounded-full hover:bg-white/10 transition-colors group"
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-white/30 group-hover:text-white" />
        ) : (
          <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white" />
        )}
      </button>
    </div>
  );
};
