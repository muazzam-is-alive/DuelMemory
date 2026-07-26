import React from 'react';
import { motion } from 'motion/react';
import { Bot, Users, Settings, Sun, Heart } from 'lucide-react';
import { ColorScheme } from '../types';

interface MainMenuProps {
  colorScheme?: ColorScheme;
  onStartVsBot: () => void;
  onStartVsPlayer: () => void;
  onOpenSettings: () => void;
  onToggleColorScheme?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  colorScheme = 'BRIGHT',
  onStartVsBot,
  onStartVsPlayer,
  onOpenSettings,
  onToggleColorScheme,
}) => {
  const isBright = colorScheme === 'BRIGHT';
  const isPink = colorScheme === 'NEON_PINK';

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-between p-6 relative z-10 my-auto min-h-[520px] select-none max-w-sm mx-auto">
      {/* TOP BAR: Theme Switcher & Settings */}
      <div className="w-full flex items-center justify-between pt-2">
        <button
          onClick={onToggleColorScheme}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border transition-all active:scale-95 ${
            isBright
              ? 'bg-amber-100/90 border-amber-300 text-amber-900 shadow-sm'
              : isPink
              ? 'bg-pink-100 border-pink-300 text-pink-900 shadow-sm'
              : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 shadow-sm'
          }`}
        >
          {isBright ? (
            <>
              <Sun className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Bright Mode</span>
            </>
          ) : isPink ? (
            <>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-400" />
              <span>Bright Pink</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>Dark Theme</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className={`p-2.5 rounded-full border transition-all active:scale-95 ${
            isBright
              ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              : isPink
              ? 'bg-white border-pink-200 text-pink-700 hover:bg-pink-50 shadow-sm'
              : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white'
          }`}
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* NON-CLICKABLE PLAY TITLE */}
      <motion.div
        className="flex flex-col items-center text-center my-auto py-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1
          className={`text-5xl sm:text-6xl font-black tracking-tight flex items-center justify-center gap-3 ${
            isBright
              ? 'text-slate-900 drop-shadow-sm'
              : isPink
              ? 'text-pink-900 drop-shadow-sm'
              : 'text-white'
          }`}
        >
          <span className="text-amber-500 text-4xl sm:text-5xl">▶</span>
          <span>PLAY</span>
        </h1>
      </motion.div>

      {/* STRICT 3-OPTION MENU */}
      <div className="w-full flex flex-col gap-4 my-auto">
        {/* 1. VS BOT */}
        <button
          onClick={onStartVsBot}
          className={`w-full py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 border transition-all active:scale-[0.98] cursor-pointer touch-manipulation ${
            isBright
              ? 'bg-white text-slate-900 border-slate-200/90 shadow-md hover:bg-slate-50'
              : isPink
              ? 'bg-white text-pink-950 border-pink-200 shadow-md hover:bg-pink-50/80'
              : 'bg-slate-900 text-white border-white/10 hover:border-white/20'
          }`}
        >
          <span className="text-2xl">🤖</span>
          <span>VS BOT</span>
        </button>

        {/* 2. VS PLAYER */}
        <button
          onClick={onStartVsPlayer}
          className={`w-full py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 border transition-all active:scale-[0.98] cursor-pointer touch-manipulation ${
            isBright
              ? 'bg-white text-slate-900 border-slate-200/90 shadow-md hover:bg-slate-50'
              : isPink
              ? 'bg-white text-pink-950 border-pink-200 shadow-md hover:bg-pink-50/80'
              : 'bg-slate-900 text-white border-white/10 hover:border-white/20'
          }`}
        >
          <span className="text-2xl">👥</span>
          <span>VS PLAYER</span>
        </button>

        {/* 3. SETTINGS */}
        <button
          onClick={onOpenSettings}
          className={`w-full py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 border transition-all active:scale-[0.98] cursor-pointer touch-manipulation ${
            isBright
              ? 'bg-white text-slate-900 border-slate-200/90 shadow-md hover:bg-slate-50'
              : isPink
              ? 'bg-white text-pink-950 border-pink-200 shadow-md hover:bg-pink-50/80'
              : 'bg-slate-900 text-white border-white/10 hover:border-white/20'
          }`}
        >
          <span className="text-2xl">⚙</span>
          <span>SETTINGS</span>
        </button>
      </div>

      <div className="h-6" />
    </div>
  );
};
