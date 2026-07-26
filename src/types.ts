export type GameMode = 'SINGLE' | 'VS_BOT' | 'MULTIPLAYER';

export type BotDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'IMPOSSIBLE';

export type BoardSize = '4x4' | '4x5' | '4x6' | '5x6' | '6x6';

export type ThemeId = 
  | 'animals'
  | 'wild_animals'
  | 'birds'
  | 'sea_animals'
  | 'dinosaurs'
  | 'fantasy_creatures'
  | 'dragons'
  | 'fairies'
  | 'fantasy_characters'
  | 'space'
  | 'planets'
  | 'astronauts'
  | 'aliens'
  | 'indian_culture'
  | 'festivals'
  | 'mythology'
  | 'indian_food'
  | 'cartoons'
  | 'emoji'
  | 'gaming'
  | 'sports'
  | 'vehicles'
  | 'fruits'
  | 'flowers'
  | 'nature'
  | 'gems'
  | 'arcade'
  | 'logos'
  | 'classic';

export interface CardItem {
  id: string; // unique card instance id
  pairId: string; // identifier matching its pair
  symbol: string; // text/emoji or icon name
  name: string; // descriptive name
  imageUrl?: string; // collectible artwork image URL
  color: string; // Tailwind/HEX gradient for back/front accent
  isFlipped: boolean;
  isMatched: boolean;
  matchedByPlayerId?: number;
}

export interface Player {
  id: number;
  name: string;
  avatar: string; // icon or emoji
  color: string; // theme color
  score: number;
  matches: number;
  isBot?: boolean;
  botDifficulty?: BotDifficulty;
}

export type ColorScheme = 'BRIGHT' | 'AMOLED_DARK' | 'NEON_PINK';

export interface GameSettings {
  musicVolume: number; // 0 to 1
  sfxVolume: number; // 0 to 1
  musicEnabled: boolean;
  sfxEnabled: boolean;
  selectedTheme: ThemeId;
  boardSize: BoardSize;
  particlesEnabled: boolean;
  flipSpeedMs: number; // e.g., 180
  showAndroidFrame: boolean;
  colorScheme: ColorScheme;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalPairsMatched: number;
  totalMoves: number;
  bestTimeSeconds: Record<BoardSize, number | null>;
  bestAccuracy: number; // percentage
  highestCombo: number;
  vsBotWins: Record<BotDifficulty, number>;
  vsBotLosses: Record<BotDifficulty, number>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface MemoryLogItem {
  cardId: string;
  pairId: string;
  seenAtTurn: number;
}
