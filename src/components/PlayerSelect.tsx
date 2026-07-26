import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Users, UserPlus, Sparkles } from 'lucide-react';
import { ColorScheme } from '../types';

interface PlayerSelectProps {
  colorScheme?: ColorScheme;
  onSelectPlayerCount: (count: number) => void;
  onBack: () => void;
}

export const PlayerSelect: React.FC<PlayerSelectProps> = ({
  colorScheme = 'BRIGHT',
  onSelectPlayerCount,
  onBack,
}) => {
  const isBright = colorScheme === 'BRIGHT';
  const isPink = colorScheme === 'NEON_PINK';

  const options = [
    {
      count: 1,
      label: '1 PLAYER',
      icon: User,
      gradient: 'from-rose-500 via-red-500 to-pink-600',
      shadow: 'shadow-rose-500/30',
      border: 'border-rose-300/60',
      accentColor: 'bg-rose-400',
    },
    {
      count: 2,
      label: '2 PLAYERS',
      icon: Users,
      gradient: 'from-blue-500 via-indigo-500 to-sky-600',
      shadow: 'shadow-blue-500/30',
      border: 'border-blue-300/60',
      accentColor: 'bg-blue-400',
    },
    {
      count: 3,
      label: '3 PLAYERS',
      icon: Users,
      gradient: 'from-emerald-500 via-teal-500 to-green-600',
      shadow: 'shadow-emerald-500/30',
      border: 'border-emerald-300/60',
      accentColor: 'bg-emerald-400',
    },
    {
      count: 4,
      label: '4 PLAYERS',
      icon: UserPlus,
      gradient: 'from-amber-400 via-yellow-500 to-orange-500',
      shadow: 'shadow-amber-500/30',
      border: 'border-amber-300/60',
      accentColor: 'bg-amber-400',
    },
  ];

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-between p-6 relative z-10 my-auto min-h-[580px] select-none max-w-md mx-auto">
      {/* TOP BAR */}
      <div className="w-full flex items-center justify-between pt-2 mb-4">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border transition-all active:scale-95 ${
            isBright
              ? 'bg-white border-slate-200 text-slate-800 shadow-sm hover:bg-slate-50'
              : isPink
              ? 'bg-white/80 border-pink-200 text-slate-800 shadow-sm hover:bg-white'
              : 'bg-slate-900 border-white/10 text-slate-200 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 text-[11px] font-extrabold text-slate-600 border border-slate-200/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Pass & Play</span>
        </div>
      </div>

      {/* HEADER TITLE */}
      <div className="text-center my-3">
        <h2
          className={`text-3xl sm:text-4xl font-black tracking-tight ${
            isBright
              ? 'text-slate-900'
              : isPink
              ? 'text-pink-900'
              : 'text-white'
          }`}
        >
          SELECT PLAYERS
        </h2>
        <p className={`text-xs font-semibold mt-1 ${isBright ? 'text-slate-500' : isPink ? 'text-pink-600' : 'text-slate-400'}`}>
          Choose how many players are dueling
        </p>
      </div>

      {/* 2x2 LARGE COLORFUL BUTTON GRID */}
      <div className="w-full grid grid-cols-2 gap-4 my-auto">
        {options.map((opt, index) => {
          const IconComp = opt.icon;
          return (
            <motion.button
              key={opt.count}
              onClick={() => onSelectPlayerCount(opt.count)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className={`w-full aspect-[4/3.5] rounded-3xl p-4 flex flex-col items-center justify-center gap-2 text-white border-2 bg-gradient-to-br ${opt.gradient} ${opt.border} shadow-lg ${opt.shadow} transition-transform active:scale-95 hover:scale-[1.02] cursor-pointer touch-manipulation`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <IconComp className="w-7 h-7 text-white drop-shadow-md" />
              </div>
              <span className="text-base sm:text-lg font-black tracking-wide drop-shadow-sm">
                {opt.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* FOOTER NOTE */}
      <div className={`text-[11px] font-medium text-center mt-auto pt-4 ${isBright ? 'text-slate-400' : isPink ? 'text-pink-400' : 'text-slate-500'}`}>
        Each player takes turns finding card matches
      </div>
    </div>
  );
};
