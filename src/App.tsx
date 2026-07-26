/**
 * Memory Duel v4 - Android Jetpack Compose Premium Card Game
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GameMode,
  BoardSize,
  BotDifficulty,
  ThemeId,
  Player,
  GameSettings,
  GameStats,
  Achievement,
  ColorScheme,
} from './types';
import {
  loadSettings,
  saveSettings,
  loadStats,
  saveStats,
  loadAchievements,
  saveAchievements,
  DEFAULT_STATS,
} from './utils/storage';
import { soundManager } from './utils/sound';
import { ParticleBackground } from './components/ParticleBackground';
import { AndroidFrame } from './components/AndroidFrame';
import { MainMenu } from './components/MainMenu';
import { PlayerSelect } from './components/PlayerSelect';
import { GameSetup } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { PauseModal } from './components/PauseModal';
import { VictoryModal } from './components/VictoryModal';
import { SettingsModal } from './components/SettingsModal';
import { OnlineMultiplayerModal } from './components/OnlineMultiplayerModal';

type AppScreen = 'MAIN_MENU' | 'PLAYER_SELECT' | 'SETUP' | 'GAME';
type ModalType = 'SETTINGS' | 'PAUSE' | 'VICTORY' | 'ONLINE' | null;

export default function App() {
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);

  const [screen, setScreen] = useState<AppScreen>('MAIN_MENU');
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode>('SINGLE');
  const [selectedPlayerCount, setSelectedPlayerCount] = useState<number>(2);

  // Game configuration
  const [activeBoardSize, setActiveBoardSize] = useState<BoardSize>(settings.boardSize);
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>(settings.selectedTheme);
  const [activePlayers, setActivePlayers] = useState<Player[]>([]);

  // Victory modal summary state
  const [victorySummary, setVictorySummary] = useState<{
    players: Player[];
    winner: Player;
    totalMoves: number;
    timerSeconds: number;
    highestCombo: number;
    accuracyPercentage: number;
    newlyUnlocked: Achievement[];
  } | null>(null);

  // Background music management
  useEffect(() => {
    if (settings.musicEnabled) {
      soundManager.startBackgroundMusic(true, settings.musicVolume);
    } else {
      soundManager.stopBackgroundMusic();
    }
  }, [settings.musicEnabled, settings.musicVolume]);

  // Update Settings
  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Quick Color Scheme Toggle (BRIGHT -> AMOLED_DARK -> NEON_PINK -> BRIGHT)
  const handleToggleColorScheme = () => {
    soundManager.playTap(settings.sfxEnabled, settings.sfxVolume);
    let nextScheme: ColorScheme = 'AMOLED_DARK';
    if (settings.colorScheme === 'BRIGHT') nextScheme = 'AMOLED_DARK';
    else if (settings.colorScheme === 'AMOLED_DARK') nextScheme = 'NEON_PINK';
    else if (settings.colorScheme === 'NEON_PINK') nextScheme = 'BRIGHT';

    handleUpdateSettings({ ...settings, colorScheme: nextScheme });
  };

  // Start Mode Setup
  const handleStartMode = (mode: GameMode) => {
    soundManager.playTap(settings.sfxEnabled, settings.sfxVolume);
    setSelectedMode(mode);
    setScreen('SETUP');
  };

  // Launch Game Match
  const handleStartGame = (config: {
    boardSize: BoardSize;
    themeId: ThemeId;
    botDifficulty?: BotDifficulty;
    players: Player[];
  }) => {
    soundManager.playTap(settings.sfxEnabled, settings.sfxVolume);
    setActiveBoardSize(config.boardSize);
    setActiveThemeId(config.themeId);
    setActivePlayers(config.players);
    setScreen('GAME');
  };

  // Handle Match Over & Achievements Check
  const handleGameOver = (summary: {
    players: Player[];
    winner: Player;
    totalMoves: number;
    timerSeconds: number;
    highestCombo: number;
    accuracyPercentage: number;
  }) => {
    // 1. Update Stats
    const isHumanWinner = !summary.winner.isBot;
    const botPlayer = summary.players.find((p) => p.isBot);
    const botDiff = botPlayer?.botDifficulty;

    const pairsMatched = summary.players.reduce((sum, p) => sum + p.score, 0);

    const updatedStats: GameStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: isHumanWinner ? stats.gamesWon + 1 : stats.gamesWon,
      totalPairsMatched: stats.totalPairsMatched + pairsMatched,
      totalMoves: stats.totalMoves + summary.totalMoves,
      highestCombo: Math.max(stats.highestCombo, summary.highestCombo),
      bestAccuracy: Math.max(stats.bestAccuracy, summary.accuracyPercentage),
      bestTimeSeconds: {
        ...stats.bestTimeSeconds,
        [activeBoardSize]:
          stats.bestTimeSeconds[activeBoardSize] === null
            ? summary.timerSeconds
            : Math.min(stats.bestTimeSeconds[activeBoardSize]!, summary.timerSeconds),
      },
      vsBotWins: {
        ...stats.vsBotWins,
        ...(botDiff && isHumanWinner ? { [botDiff]: (stats.vsBotWins[botDiff] || 0) + 1 } : {}),
      },
      vsBotLosses: {
        ...stats.vsBotLosses,
        ...(botDiff && !isHumanWinner ? { [botDiff]: (stats.vsBotLosses[botDiff] || 0) + 1 } : {}),
      },
    };

    setStats(updatedStats);
    saveStats(updatedStats);

    // 2. Check & Unlock Achievements
    const newlyUnlocked: Achievement[] = [];
    const updatedAchievements = achievements.map((ach) => {
      if (ach.unlocked) return ach;

      let shouldUnlock = false;
      let newProgress = ach.progress;

      if (ach.id === 'first_win' && updatedStats.gamesWon >= 1) shouldUnlock = true;
      if (ach.id === 'bot_slayer_easy' && botDiff === 'EASY' && isHumanWinner) shouldUnlock = true;
      if (ach.id === 'bot_slayer_hard' && botDiff === 'HARD' && isHumanWinner) shouldUnlock = true;
      if (ach.id === 'bot_slayer_impossible' && botDiff === 'IMPOSSIBLE' && isHumanWinner)
        shouldUnlock = true;
      if (ach.id === 'combo_streak_3' && summary.highestCombo >= 3) shouldUnlock = true;
      if (ach.id === 'combo_streak_5' && summary.highestCombo >= 5) shouldUnlock = true;
      if (ach.id === 'board_6x6' && activeBoardSize === '6x6') shouldUnlock = true;
      if (ach.id === 'flawless_accuracy' && summary.accuracyPercentage >= 80) shouldUnlock = true;
      if (ach.id === 'speed_demon' && activeBoardSize === '4x4' && summary.timerSeconds < 30)
        shouldUnlock = true;
      if (ach.id === 'multiplayer_champion' && summary.players.length >= 3) shouldUnlock = true;

      if (ach.id === 'pair_collector_50') {
        newProgress = Math.min(50, updatedStats.totalPairsMatched);
        if (newProgress >= 50) shouldUnlock = true;
      }
      if (ach.id === 'pair_collector_200') {
        newProgress = Math.min(200, updatedStats.totalPairsMatched);
        if (newProgress >= 200) shouldUnlock = true;
      }

      if (shouldUnlock) {
        const unlockedObj = { ...ach, unlocked: true, progress: newProgress };
        newlyUnlocked.push(unlockedObj);
        return unlockedObj;
      }

      return { ...ach, progress: newProgress };
    });

    setAchievements(updatedAchievements);
    saveAchievements(updatedAchievements);

    // 3. Show Victory Modal
    setVictorySummary({
      ...summary,
      newlyUnlocked,
    });
    setModal('VICTORY');
  };

  // Reset All Stats & Achievements
  const handleResetData = () => {
    soundManager.playTap(settings.sfxEnabled, settings.sfxVolume);
    setStats(DEFAULT_STATS);
    saveStats(DEFAULT_STATS);
    localStorage.removeItem('memory_duel_achievements_v1');
    setAchievements(loadAchievements());
  };

  return (
    <AndroidFrame
      showFrame={settings.showAndroidFrame}
      onToggleFrame={() =>
        handleUpdateSettings({ ...settings, showAndroidFrame: !settings.showAndroidFrame })
      }
    >
      {/* Dynamic Particle Canvas */}
      <ParticleBackground
        enabled={settings.particlesEnabled}
        colorScheme={settings.colorScheme}
      />

      {/* SCREEN ROUTING */}
      {screen === 'MAIN_MENU' && (
        <MainMenu
          colorScheme={settings.colorScheme}
          onStartVsBot={() => {
            soundManager.playTap(settings.sfxEnabled, settings.sfxVolume);
            setSelectedMode('VS_BOT');
            setSelectedPlayerCount(2);
            setScreen('SETUP');
          }}
          onStartVsPlayer={() => {
            soundManager.playTap(settings.sfxEnabled, settings.sfxVolume);
            setScreen('PLAYER_SELECT');
          }}
          onOpenSettings={() => {
            soundManager.playTap(settings.sfxEnabled, settings.sfxVolume);
            setModal('SETTINGS');
          }}
          onToggleColorScheme={handleToggleColorScheme}
        />
      )}

      {screen === 'PLAYER_SELECT' && (
        <PlayerSelect
          colorScheme={settings.colorScheme}
          onSelectPlayerCount={(count) => {
            soundManager.playTap(settings.sfxEnabled, settings.sfxVolume);
            setSelectedPlayerCount(count);
            if (count === 1) {
              setSelectedMode('SINGLE');
            } else {
              setSelectedMode('MULTIPLAYER');
            }
            setScreen('SETUP');
          }}
          onBack={() => {
            soundManager.playTap(settings.sfxEnabled, settings.sfxVolume);
            setScreen('MAIN_MENU');
          }}
        />
      )}

      {screen === 'SETUP' && (
        <GameSetup
          mode={selectedMode}
          initialTheme={settings.selectedTheme}
          initialBoardSize={settings.boardSize}
          initialPlayerCount={selectedPlayerCount}
          onBack={() => {
            soundManager.playTap(settings.sfxEnabled, settings.sfxVolume);
            if (selectedMode === 'VS_BOT') {
              setScreen('MAIN_MENU');
            } else {
              setScreen('PLAYER_SELECT');
            }
          }}
          onStartGame={handleStartGame}
        />
      )}

      {screen === 'GAME' && (
        <GameBoard
          boardSize={activeBoardSize}
          themeId={activeThemeId}
          players={activePlayers}
          sfxEnabled={settings.sfxEnabled}
          musicEnabled={settings.musicEnabled}
          sfxVolume={settings.sfxVolume}
          musicVolume={settings.musicVolume}
          flipSpeedMs={settings.flipSpeedMs}
          colorScheme={settings.colorScheme}
          onToggleSound={() =>
            handleUpdateSettings({ ...settings, sfxEnabled: !settings.sfxEnabled })
          }
          onPause={() => {
            soundManager.playTap(settings.sfxEnabled, settings.sfxVolume);
            setModal('PAUSE');
          }}
          onGameOver={handleGameOver}
        />
      )}

      {/* MODALS */}
      {modal === 'PAUSE' && (
        <PauseModal
          onResume={() => setModal(null)}
          onRestart={() => {
            setModal(null);
            setScreen('GAME');
          }}
          onOpenSettings={() => setModal('SETTINGS')}
          onQuitToMenu={() => {
            setModal(null);
            setScreen('MAIN_MENU');
          }}
        />
      )}

      {modal === 'VICTORY' && victorySummary && (
        <VictoryModal
          players={victorySummary.players}
          winner={victorySummary.winner}
          totalMoves={victorySummary.totalMoves}
          timerSeconds={victorySummary.timerSeconds}
          highestCombo={victorySummary.highestCombo}
          accuracyPercentage={victorySummary.accuracyPercentage}
          unlockedAchievements={victorySummary.newlyUnlocked}
          onPlayAgain={() => {
            setModal(null);
            setScreen('GAME');
          }}
          onMainMenu={() => {
            setModal(null);
            setScreen('MAIN_MENU');
          }}
        />
      )}

      {modal === 'SETTINGS' && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetData={handleResetData}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'ONLINE' && (
        <OnlineMultiplayerModal
          colorScheme={settings.colorScheme}
          onClose={() => setModal(null)}
        />
      )}
    </AndroidFrame>
  );
}
