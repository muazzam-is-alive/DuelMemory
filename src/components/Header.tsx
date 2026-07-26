import React from 'react';
import { Player, ColorScheme } from '../types';
import { Pause, Clock } from 'lucide-react';

interface HeaderProps {
  players: Player[];
  activePlayerIndex: number;
  timerSeconds: number;
  onPause: () => void;
  colorScheme?: ColorScheme;
}

export const Header: React.FC<HeaderProps> = ({
  players,
  activePlayerIndex,
  timerSeconds,
  onPause,
  colorScheme = 'BRIGHT',
}) => {
  const isBright = colorScheme === 'BRIGHT';
  const isPink = colorScheme === 'NEON_PINK';

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full px-3 pt-2 pb-1 flex items-center justify-between z-30 select-none max-w-xl mx-auto shrink-0">
      {/* LEFT: Current Player's Turn & Score */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {players.map((p, idx) => {
          const isActive = idx === activePlayerIndex;
          return (
            <div
              key={p.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black transition-all border shrink-0 ${
                isActive
                  ? isBright
                    ? 'bg-amber-400 border-amber-300 text-slate-900 shadow-md shadow-amber-400/30 scale-105'
                    : isPink
                    ? 'bg-pink-500 border-pink-400 text-white shadow-md shadow-pink-300/60 scale-105'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-300 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-105'
                  : isBright
                  ? 'bg-white/90 border-slate-200 text-slate-600 opacity-80'
                  : isPink
                  ? 'bg-white/90 border-pink-200 text-pink-900 opacity-90'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 opacity-60'
              }`}
            >
              <span>{p.avatar}</span>
              <span className="truncate max-w-[80px]">{p.name}</span>
              <span
                className={`font-mono px-1.5 py-0.2 rounded-full text-[11px] font-black ${
                  isActive
                    ? isBright
                      ? 'bg-slate-900 text-amber-300'
                      : 'bg-black/30 text-white'
                    : isBright
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-black/40 text-slate-300'
                }`}
              >
                {p.score}
              </span>
            </div>
          );
        })}
      </div>

      {/* RIGHT: Compact Timer & Pause Button */}
      <div className="flex items-center gap-1.5 shrink-0 pl-1">
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full border font-mono text-xs font-black ${
            isBright
              ? 'bg-white border-amber-300 text-amber-900 shadow-sm'
              : isPink
              ? 'bg-white border-pink-300 text-pink-900 shadow-sm'
              : 'bg-slate-900/80 border-cyan-500/30 text-cyan-300'
          }`}
        >
          <Clock className={`w-3.5 h-3.5 ${isBright ? 'text-amber-600' : isPink ? 'text-pink-500' : 'text-cyan-400'}`} />
          <span>{formatTime(timerSeconds)}</span>
        </div>

        <button
          onClick={onPause}
          className={`p-1.5 rounded-full border transition-all active:scale-90 ${
            isBright
              ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
              : isPink
              ? 'bg-white hover:bg-pink-50 border-pink-200 text-pink-700 shadow-sm'
              : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300 hover:text-white'
          }`}
          title="Pause Game"
        >
          <Pause className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
