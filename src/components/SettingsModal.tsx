import React from 'react';
import { GameSettings, ThemeId } from '../types';
import { GAME_THEMES } from '../data/themes';
import {
  X,
  Settings,
  Volume2,
  Music,
  Smartphone,
  Sparkles,
  Palette,
  RotateCcw,
  Zap,
  Heart,
  Sun,
  Moon,
} from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onClose,
}) => {
  const isBright = settings.colorScheme === 'BRIGHT';
  const isPink = settings.colorScheme === 'NEON_PINK';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div
        className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative border ${
          isBright
            ? 'bg-white text-slate-800 border-amber-200'
            : isPink
            ? 'bg-slate-950 text-white border-pink-500/30'
            : 'bg-slate-900 text-white border-purple-500/30'
        }`}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${isBright ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="flex items-center gap-2">
            <Settings className={`w-5 h-5 ${isBright ? 'text-amber-600' : isPink ? 'text-pink-400' : 'text-cyan-400'}`} />
            <h3 className={`text-base font-black ${isBright ? 'text-slate-900' : 'text-white'}`}>Game Settings</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isBright ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-4 pr-1">
          {/* COLOR THEME MODE */}
          <div className={`p-3 rounded-2xl border flex flex-col gap-2 ${isBright ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/70 border-white/10'}`}>
            <span className={`text-xs font-black flex items-center gap-1.5 ${isBright ? 'text-slate-700' : 'text-slate-200'}`}>
              <Palette className={`w-4 h-4 ${isBright ? 'text-amber-600' : 'text-purple-400'}`} />
              <span>UI Visual Theme Mode</span>
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => onUpdateSettings({ ...settings, colorScheme: 'BRIGHT' })}
                className={`py-2 px-1.5 rounded-xl text-[11px] font-black border flex items-center justify-center gap-1 transition-all ${
                  isBright
                    ? 'bg-amber-400 border-amber-300 text-slate-900 shadow-md'
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-900 fill-amber-300" />
                <span>Bright</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ ...settings, colorScheme: 'AMOLED_DARK' })}
                className={`py-2 px-1.5 rounded-xl text-[11px] font-black border flex items-center justify-center gap-1 transition-all ${
                  settings.colorScheme === 'AMOLED_DARK'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : isBright
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <span>Dark</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ ...settings, colorScheme: 'NEON_PINK' })}
                className={`py-2 px-1.5 rounded-xl text-[11px] font-black border flex items-center justify-center gap-1 transition-all ${
                  isPink
                    ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.4)]'
                    : isBright
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                <span>Pink</span>
              </button>
            </div>
          </div>

          {/* CARD FLIP SPEED */}
          <div className={`p-3 rounded-2xl border flex flex-col gap-2 ${isBright ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/70 border-white/10'}`}>
            <span className={`text-xs font-black flex items-center gap-1.5 ${isBright ? 'text-slate-700' : 'text-slate-200'}`}>
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Card 3D Flip Speed</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { speed: 160, label: 'Fast (160ms)' },
                { speed: 250, label: 'Medium (250ms)' },
                { speed: 380, label: 'Smooth (380ms)' },
              ].map((item) => (
                <button
                  key={item.speed}
                  onClick={() => onUpdateSettings({ ...settings, flipSpeedMs: item.speed })}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-extrabold border transition-colors ${
                    settings.flipSpeedMs === item.speed
                      ? isBright
                        ? 'bg-amber-400 border-amber-300 text-slate-900 shadow-sm'
                        : isPink
                        ? 'bg-pink-500/20 border-pink-400 text-pink-300'
                        : 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : isBright
                      ? 'bg-white border-slate-200 text-slate-600'
                      : 'bg-slate-900 border-white/5 text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* SFX SOUNDS */}
          <div className={`p-3 rounded-2xl border flex flex-col gap-2 ${isBright ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/70 border-white/10'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black flex items-center gap-1.5 ${isBright ? 'text-slate-700' : 'text-slate-200'}`}>
                <Volume2 className="w-4 h-4 text-emerald-500" />
                <span>Sound Effects (SFX)</span>
              </span>
              <button
                onClick={() => onUpdateSettings({ ...settings, sfxEnabled: !settings.sfxEnabled })}
                className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                  settings.sfxEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>
            </div>
            {settings.sfxEnabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) => onUpdateSettings({ ...settings, sfxVolume: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            )}
          </div>

          {/* MUSIC */}
          <div className={`p-3 rounded-2xl border flex flex-col gap-2 ${isBright ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/70 border-white/10'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black flex items-center gap-1.5 ${isBright ? 'text-slate-700' : 'text-slate-200'}`}>
                <Music className="w-4 h-4 text-purple-500" />
                <span>Background Music</span>
              </span>
              <button
                onClick={() => onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })}
                className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                  settings.musicEnabled ? 'bg-purple-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>
            </div>
            {settings.musicEnabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={(e) => onUpdateSettings({ ...settings, musicVolume: parseFloat(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
            )}
          </div>

          {/* CARD COLLECTION SELECTOR */}
          <div className={`p-3 rounded-2xl border flex flex-col gap-2 ${isBright ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/70 border-white/10'}`}>
            <span className={`text-xs font-black flex items-center gap-1.5 ${isBright ? 'text-slate-700' : 'text-slate-200'}`}>
              <Palette className="w-4 h-4 text-indigo-500" />
              <span>Card Collection Theme</span>
            </span>
            <select
              value={settings.selectedTheme}
              onChange={(e) => onUpdateSettings({ ...settings, selectedTheme: e.target.value as ThemeId })}
              className={`w-full border rounded-xl p-2 text-xs font-bold focus:outline-none ${
                isBright ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-white/10 text-white'
              }`}
            >
              {Object.values(GAME_THEMES).map((th) => (
                <option key={th.id} value={th.id}>
                  {th.name} ({th.pairs.length} pairs)
                </option>
              ))}
            </select>
          </div>

          {/* DEVICE FRAME TOGGLE */}
          <div className={`p-3 rounded-2xl border flex items-center justify-between ${isBright ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/70 border-white/10'}`}>
            <span className={`text-xs font-black flex items-center gap-1.5 ${isBright ? 'text-slate-700' : 'text-slate-200'}`}>
              <Smartphone className="w-4 h-4 text-purple-500" />
              <span>Android Phone Frame</span>
            </span>
            <button
              onClick={() => onUpdateSettings({ ...settings, showAndroidFrame: !settings.showAndroidFrame })}
              className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                settings.showAndroidFrame ? 'bg-purple-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* RESET DATA */}
          <button
            onClick={onResetData}
            className="w-full py-2.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-300/50 text-xs font-bold flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>Reset Game Stats</span>
          </button>
        </div>
      </div>
    </div>
  );
};
