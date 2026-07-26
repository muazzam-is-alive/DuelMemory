import React from 'react';
import { Play, RotateCcw, Settings, Home } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onQuitToMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onOpenSettings,
  onQuitToMenu,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xs bg-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.3)] flex flex-col items-center text-center">
        <h2 className="text-xl font-extrabold text-white mb-1">Game Paused</h2>
        <p className="text-xs text-slate-400 mb-6">Take a breath and continue</p>

        <div className="w-full flex flex-col gap-2.5">
          {/* Resume */}
          <button
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>Resume Game</span>
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Restart Match</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span>Audio & Settings</span>
          </button>

          {/* Quit to Menu */}
          <button
            onClick={onQuitToMenu}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-semibold text-xs border border-rose-800/50 flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <Home className="w-4 h-4 text-rose-400" />
            <span>Quit to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
