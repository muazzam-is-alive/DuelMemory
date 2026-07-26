import React from 'react';
import { motion } from 'motion/react';
import { Player, Achievement } from '../types';
import { Trophy, RefreshCw, Home, Sparkles, Flame, Clock, Target, Award } from 'lucide-react';

interface VictoryModalProps {
  players: Player[];
  winner: Player;
  totalMoves: number;
  timerSeconds: number;
  highestCombo: number;
  accuracyPercentage: number;
  unlockedAchievements: Achievement[];
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  players,
  winner,
  totalMoves,
  timerSeconds,
  highestCombo,
  accuracyPercentage,
  unlockedAchievements,
  onPlayAgain,
  onMainMenu,
}) => {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}m ${secs}s`;
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <motion.div
        className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-[#121222] border border-purple-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex flex-col items-center text-center relative overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
      >
        {/* Background glow flare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Trophy Header Icon */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.6)] border border-yellow-300">
            <Trophy className="w-9 h-9 text-slate-950 fill-slate-950" />
          </div>
          <Sparkles className="w-6 h-6 text-cyan-300 absolute -top-1 -right-2 animate-bounce" />
        </div>

        {/* Victory Title */}
        <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
          {players.length > 1 ? `${winner.name} Wins!` : 'Match Completed!'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Great memory performance!</p>

        {/* SCOREBOARD PODIUM TABLE */}
        <div className="w-full my-4 bg-slate-950/60 rounded-2xl p-3 border border-slate-800 flex flex-col gap-2">
          {sortedPlayers.map((p, rank) => (
            <div
              key={p.id}
              className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold ${
                rank === 0
                  ? 'bg-gradient-to-r from-amber-950/60 to-purple-950/60 border border-amber-500/40 text-amber-300'
                  : 'bg-slate-900/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 font-bold text-slate-400">#{rank + 1}</span>
                <span className="text-base">{p.avatar}</span>
                <span className="truncate max-w-[110px]">{p.name}</span>
              </div>
              <span className="font-mono text-cyan-300">{p.score} pairs</span>
            </div>
          ))}
        </div>

        {/* MATCH STATS METRICS GRID */}
        <div className="w-full grid grid-cols-3 gap-2 mb-4">
          {/* Time */}
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col items-center">
            <Clock className="w-4 h-4 text-cyan-400 mb-0.5" />
            <span className="text-[10px] text-slate-400">Time</span>
            <span className="text-xs font-bold text-white font-mono">{formatTime(timerSeconds)}</span>
          </div>

          {/* Accuracy */}
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col items-center">
            <Target className="w-4 h-4 text-emerald-400 mb-0.5" />
            <span className="text-[10px] text-slate-400">Accuracy</span>
            <span className="text-xs font-bold text-white font-mono">{accuracyPercentage}%</span>
          </div>

          {/* Highest Combo */}
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col items-center">
            <Flame className="w-4 h-4 text-rose-400 mb-0.5" />
            <span className="text-[10px] text-slate-400">Best Combo</span>
            <span className="text-xs font-bold text-white font-mono">{highestCombo}x</span>
          </div>
        </div>

        {/* UNLOCKED ACHIEVEMENTS NOTIFICATION */}
        {unlockedAchievements.length > 0 && (
          <div className="w-full mb-4 bg-gradient-to-r from-amber-950/80 to-purple-950/80 border border-amber-500/50 rounded-2xl p-2.5 flex items-center gap-2 text-left shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Award className="w-6 h-6 text-amber-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-amber-300">Badge Unlocked!</span>
              <span className="text-[10px] text-slate-300">
                {unlockedAchievements.map((a) => a.title).join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="w-full flex gap-2">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
          <button
            onClick={onMainMenu}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
