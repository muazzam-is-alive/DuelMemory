import React from 'react';
import { X, Info, Sparkles, Shield, Bot, Users, Smartphone } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-purple-500/30 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">About Memory Duel</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4 pr-1 text-xs text-slate-300">
          {/* INTRO HERO */}
          <div className="bg-gradient-to-r from-purple-950/60 to-indigo-950/60 p-3.5 rounded-2xl border border-purple-500/30 flex flex-col gap-1 text-center">
            <span className="text-sm font-extrabold text-white tracking-wide">
              MEMORY DUEL v2.5
            </span>
            <span className="text-[11px] text-cyan-300 font-medium">
              Android Jetpack Compose Memory Matching Game
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Inspired by classic Concentration card games, elevated with modern dark aesthetics,
              smart Bot AI, local multiplayer duels, customizable themes, and stats tracking.
            </p>
          </div>

          {/* RULES GUIDE */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>How to Play</span>
            </span>
            <ul className="list-disc list-inside space-y-1 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-[11px]">
              <li>Tap any card to flip and reveal its symbol.</li>
              <li>Tap a second card to attempt a match.</li>
              <li>
                <strong className="text-cyan-300">Matching Pair:</strong> You score 1 point, maintain a combo streak, and earn another turn!
              </li>
              <li>
                <strong className="text-rose-300">Mismatch:</strong> Both cards flip back face-down, and turn passes to the next player.
              </li>
              <li>Clear the board with maximum accuracy and fewest moves!</li>
            </ul>
          </div>

          {/* BOT AI DIFFICULTIES */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Bot AI Mechanics</span>
            </span>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
              <p>
                <strong className="text-emerald-400">Easy:</strong> Mostly random card guesses.
              </p>
              <p>
                <strong className="text-blue-400">Medium:</strong> Remembers cards seen in last ~4 turns.
              </p>
              <p>
                <strong className="text-purple-400">Hard:</strong> 85% memory retention across match history.
              </p>
              <p>
                <strong className="text-rose-400">Impossible:</strong> Flawless photogenic memory.
              </p>
            </div>
          </div>

          {/* GAME MODES */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Game Modes</span>
            </span>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 space-y-1 text-[11px]">
              <p>
                <strong>Single Player:</strong> Solo time & move memory sprint.
              </p>
              <p>
                <strong>VS Bot:</strong> Turn-based duel against AI.
              </p>
              <p>
                <strong>Local Multiplayer:</strong> Pass & play with 2, 3, or 4 players on one device.
              </p>
            </div>
          </div>

          {/* TECH STACK */}
          <div className="flex flex-col gap-1 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              <span>Architecture & Tech</span>
            </div>
            <span>Built with React, Motion 3D Transforms, Web Audio Synthesizer, and Tailwind CSS.</span>
            <span>Targeting Android 7.0+ Portrait devices.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
