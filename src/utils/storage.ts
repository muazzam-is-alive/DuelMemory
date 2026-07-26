import { GameSettings, GameStats, Achievement } from '../types';
import { DEFAULT_ACHIEVEMENTS } from '../data/achievements';

const SETTINGS_KEY = 'memory_duel_settings_v1';
const STATS_KEY = 'memory_duel_stats_v1';
const ACHIEVEMENTS_KEY = 'memory_duel_achievements_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 0.3,
  sfxVolume: 0.7,
  musicEnabled: true,
  sfxEnabled: true,
  selectedTheme: 'animals',
  boardSize: '4x4',
  particlesEnabled: true,
  flipSpeedMs: 160,
  showAndroidFrame: true,
  colorScheme: 'BRIGHT',
};

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalPairsMatched: 0,
  totalMoves: 0,
  bestTimeSeconds: {
    '4x4': null,
    '4x5': null,
    '4x6': null,
    '5x6': null,
    '6x6': null,
  },
  bestAccuracy: 0,
  highestCombo: 0,
  vsBotWins: {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
    IMPOSSIBLE: 0,
  },
  vsBotLosses: {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
    IMPOSSIBLE: 0,
  },
};

export const loadSettings = (): GameSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: GameSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
};

export const loadStats = (): GameStats => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATS,
        ...parsed,
        bestTimeSeconds: { ...DEFAULT_STATS.bestTimeSeconds, ...parsed.bestTimeSeconds },
        vsBotWins: { ...DEFAULT_STATS.vsBotWins, ...parsed.vsBotWins },
        vsBotLosses: { ...DEFAULT_STATS.vsBotLosses, ...parsed.vsBotLosses },
      };
    }
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_STATS;
};

export const saveStats = (stats: GameStats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage errors
  }
};

export const loadAchievements = (): Achievement[] => {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (raw) {
      const savedList: Achievement[] = JSON.parse(raw);
      return DEFAULT_ACHIEVEMENTS.map(def => {
        const found = savedList.find(a => a.id === def.id);
        return found ? { ...def, ...found } : def;
      });
    }
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_ACHIEVEMENTS;
};

export const saveAchievements = (achievements: Achievement[]) => {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {
    // Ignore storage errors
  }
};
