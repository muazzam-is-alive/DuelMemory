import React from 'react';
import { GameStats, BoardSize } from '../types';
import { X, BarChart2, Trophy, Clock, Target, Flame, Bot } from 'lucide-react';

interface StatisticsModalProps {
  stats: GameStats;
  onClose: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({ stats, onClose }) => {
  const winRate =
    stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  const formatBestTime = (sec: number | null) => {
    if (sec === null) return '--:--';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const boardSizesList: BoardSize[] = ['4x4', '4x5', '4x6', '5x6', '6x6'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-purple-500/30 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Player Statistics</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4 pr-1">
          {/* TOP METRICS SUMMARY */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 flex flex-col items-center">
              <Trophy className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[10px] text-slate-400">Games Won</span>
              <span className="text-sm font-bold text-white font-mono">
                {stats.gamesWon} / {stats.gamesPlayed}
              </span>
            </div>

            <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 flex flex-col items-center">
              <Target className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-[10px] text-slate-400">Win Rate</span>
              <span className="text-sm font-bold text-white font-mono">{winRate}%</span>
            </div>

            <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 flex flex-col items-center">
              <Flame className="w-4 h-4 text-rose-400 mb-1" />
              <span className="text-[10px] text-slate-400">Best Combo</span>
              <span className="text-sm font-bold text-white font-mono">{stats.highestCombo}x</span>
            </div>
          </div>

          {/* PAIRS MATCHED & MOVES */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex justify-between text-xs">
            <div className="flex flex-col">
              <span className="text-slate-400">Total Pairs Matched</span>
              <span className="text-base font-bold text-purple-300 font-mono">
                {stats.totalPairsMatched}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-400">Total Moves Played</span>
              <span className="text-base font-bold text-cyan-300 font-mono">
                {stats.totalMoves}
              </span>
            </div>
          </div>

          {/* BEST TIME RECORDS BY GRID SIZE */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Best Time Records</span>
            </span>
            <div className="bg-slate-950/60 rounded-2xl p-2.5 border border-slate-800 grid grid-cols-5 gap-1 text-center">
              {boardSizesList.map((size) => (
                <div key={size} className="flex flex-col p-1 bg-slate-900/60 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-mono">{size}</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono mt-0.5">
                    {formatBestTime(stats.bestTimeSeconds[size])}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* VS BOT AI RECORD */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>VS Bot Records</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['EASY', 'MEDIUM', 'HARD', 'IMPOSSIBLE'] as const).map((diff) => {
                const wins = stats.vsBotWins[diff] || 0;
                const losses = stats.vsBotLosses[diff] || 0;
                return (
                  <div
                    key={diff}
                    className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-300 capitalize">{diff.toLowerCase()}</span>
                    <span className="font-mono">
                      <span className="text-emerald-400 font-bold">{wins}W</span> /{' '}
                      <span className="text-rose-400 font-bold">{losses}L</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
