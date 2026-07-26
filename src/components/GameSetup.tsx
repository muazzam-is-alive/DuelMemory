import React, { useState } from 'react';
import { GameMode, BoardSize, BotDifficulty, ThemeId, Player } from '../types';
import { GAME_THEMES } from '../data/themes';
import { ArrowLeft, Play, Bot, Grid, Palette, Users } from 'lucide-react';

interface GameSetupProps {
  mode: GameMode;
  initialTheme: ThemeId;
  initialBoardSize: BoardSize;
  initialPlayerCount?: number;
  onBack: () => void;
  onStartGame: (config: {
    boardSize: BoardSize;
    themeId: ThemeId;
    botDifficulty?: BotDifficulty;
    players: Player[];
  }) => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({
  mode,
  initialTheme,
  initialBoardSize,
  initialPlayerCount = 2,
  onBack,
  onStartGame,
}) => {
  const [boardSize, setBoardSize] = useState<BoardSize>(initialBoardSize);
  const [themeId, setThemeId] = useState<ThemeId>(initialTheme);
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('MEDIUM');
  const [playerCount, setPlayerCount] = useState<number>(initialPlayerCount);

  const [playerNames, setPlayerNames] = useState<string[]>([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
  ]);

  const BOARD_SIZES: { size: BoardSize; label: string; pairs: number }[] = [
    { size: '4x4', label: '4 × 4', pairs: 8 },
    { size: '4x5', label: '4 × 5', pairs: 10 },
    { size: '4x6', label: '4 × 6', pairs: 12 },
    { size: '5x6', label: '5 × 6', pairs: 15 },
    { size: '6x6', label: '6 × 6', pairs: 18 },
  ];

  const BOT_DIFFICULTIES: { id: BotDifficulty; name: string; desc: string }[] = [
    { id: 'EASY', name: 'Easy', desc: 'Random flips' },
    { id: 'MEDIUM', name: 'Medium', desc: 'Remembers recent cards' },
    { id: 'HARD', name: 'Hard', desc: 'High memory retention' },
    { id: 'IMPOSSIBLE', name: 'Impossible', desc: 'Flawless recall' },
  ];

  const handleLaunch = () => {
    let playersList: Player[] = [];

    if (mode === 'SINGLE') {
      playersList = [
        { id: 1, name: 'You', avatar: '👤', color: 'from-amber-500 to-orange-500', score: 0, matches: 0 },
      ];
    } else if (mode === 'VS_BOT') {
      playersList = [
        { id: 1, name: 'Player', avatar: '👤', color: 'from-amber-500 to-orange-500', score: 0, matches: 0 },
        {
          id: 2,
          name: `Bot (${botDifficulty})`,
          avatar: '🤖',
          color: 'from-emerald-500 to-teal-600',
          score: 0,
          matches: 0,
          isBot: true,
          botDifficulty,
        },
      ];
    } else {
      const avatars = ['🎮', '⚡', '🔥', '💎'];
      const colors = [
        'from-amber-500 to-orange-500',
        'from-emerald-500 to-teal-600',
        'from-sky-500 to-blue-600',
        'from-rose-500 to-pink-600',
      ];
      for (let i = 0; i < playerCount; i++) {
        playersList.push({
          id: i + 1,
          name: playerNames[i] || `Player ${i + 1}`,
          avatar: avatars[i % avatars.length],
          color: colors[i % colors.length],
          score: 0,
          matches: 0,
        });
      }
    }

    onStartGame({
      boardSize,
      themeId,
      botDifficulty: mode === 'VS_BOT' ? botDifficulty : undefined,
      players: playersList,
    });
  };

  return (
    <div className="flex-1 w-full flex flex-col p-4 sm:p-5 max-w-md mx-auto z-10 my-auto select-none">
      {/* Header back */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-black border border-slate-200 shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-black tracking-widest text-amber-800 uppercase bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300">
          {mode === 'SINGLE' ? 'Single Player' : mode === 'VS_BOT' ? 'VS Bot Match' : 'Local Pass & Play'}
        </span>
      </div>

      {/* SETUP CONTENT */}
      <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar pr-1 pb-2">
        {/* BOARD SIZE SELECTOR */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <Grid className="w-4 h-4 text-amber-600" />
            <span>Board Grid Size</span>
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {BOARD_SIZES.map((b) => (
              <button
                key={b.size}
                onClick={() => setBoardSize(b.size)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                  boardSize === b.size
                    ? 'bg-amber-400 border-amber-300 text-slate-900 shadow-md font-black scale-105'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-mono font-bold">{b.label}</span>
                <span className="text-[10px] opacity-80">{b.pairs} p</span>
              </button>
            ))}
          </div>
        </div>

        {/* BOT DIFFICULTY SELECTOR */}
        {mode === 'VS_BOT' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Bot AI Difficulty</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {BOT_DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setBotDifficulty(d.id)}
                  className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                    botDifficulty === d.id
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-md font-black scale-102'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-black">{d.name}</span>
                  <span className="text-[10px] opacity-90">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MULTIPLAYER COUNT & NAMES */}
        {mode === 'MULTIPLAYER' && (
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Number of Players</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className={`py-2 px-3 rounded-xl border font-black text-xs transition-all ${
                    playerCount === count
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {count} Players
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              {Array.from({ length: playerCount }).map((_, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 font-bold">Player {idx + 1} Name</span>
                  <input
                    type="text"
                    value={playerNames[idx]}
                    onChange={(e) => {
                      const updated = [...playerNames];
                      updated[idx] = e.target.value;
                      setPlayerNames(updated);
                    }}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                    maxLength={12}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THEME SELECTOR */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-rose-500" />
            <span>Choose Card Deck Collection ({Object.keys(GAME_THEMES).length} Themes)</span>
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar p-0.5">
            {Object.values(GAME_THEMES).map((th) => (
              <button
                key={th.id}
                onClick={() => setThemeId(th.id)}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                  themeId === th.id
                    ? 'bg-amber-400 border-amber-300 text-slate-900 shadow-md font-black scale-102 ring-2 ring-amber-300'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black truncate">{th.name}</span>
                </div>
                <span className="text-[10px] opacity-80 line-clamp-1">{th.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* START GAME BUTTON */}
      <button
        onClick={handleLaunch}
        className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-white font-black text-base shadow-lg shadow-amber-500/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 border border-amber-300"
      >
        <Play className="w-5 h-5 fill-white text-white" />
        <span>START MATCH</span>
      </button>
    </div>
  );
};
