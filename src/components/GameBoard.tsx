import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CardItem, Player, BoardSize, ThemeId, MemoryLogItem, ColorScheme } from '../types';
import { GAME_THEMES } from '../data/themes';
import { getIllustrationUrl } from '../data/cardIllustrations';
import { Card3D } from './Card3D';
import { Header } from './Header';
import { soundManager } from '../utils/sound';

interface GameBoardProps {
  boardSize: BoardSize;
  themeId: ThemeId;
  players: Player[];
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  flipSpeedMs: number;
  colorScheme?: ColorScheme;
  onToggleSound: () => void;
  onPause: () => void;
  onGameOver: (summary: {
    players: Player[];
    winner: Player;
    totalMoves: number;
    timerSeconds: number;
    highestCombo: number;
    accuracyPercentage: number;
  }) => void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GameBoard: React.FC<GameBoardProps> = ({
  boardSize,
  themeId,
  players: initialPlayers,
  sfxEnabled,
  sfxVolume,
  flipSpeedMs = 160,
  colorScheme = 'BRIGHT',
  onPause,
  onGameOver,
}) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [mismatchingCardIds, setMismatchingCardIds] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [comboStreak, setComboStreak] = useState<number>(1);
  const [highestCombo, setHighestCombo] = useState<number>(1);
  const [totalMoves, setTotalMoves] = useState<number>(0);
  const [successfulMatchesCount, setSuccessfulMatchesCount] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Sync refs for async bot AI execution & closure freshness
  const cardsRef = useRef<CardItem[]>(cards);
  cardsRef.current = cards;

  const playersRef = useRef<Player[]>(players);
  playersRef.current = players;

  const activePlayerIndexRef = useRef<number>(activePlayerIndex);
  activePlayerIndexRef.current = activePlayerIndex;

  const comboStreakRef = useRef<number>(comboStreak);
  comboStreakRef.current = comboStreak;

  const highestComboRef = useRef<number>(highestCombo);
  highestComboRef.current = highestCombo;

  const sfxEnabledRef = useRef<boolean>(sfxEnabled);
  sfxEnabledRef.current = sfxEnabled;

  const sfxVolumeRef = useRef<number>(sfxVolume);
  sfxVolumeRef.current = sfxVolume;

  // Bot Memory & State Locks
  const botMemoryRef = useRef<MemoryLogItem[]>([]);
  const currentTurnCountRef = useRef<number>(1);
  const isBotRunningRef = useRef<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Initialize game board deck
  useEffect(() => {
    const themeDef = GAME_THEMES[themeId] || GAME_THEMES['animals'] || GAME_THEMES['classic'];
    let pairCount = 8;
    if (boardSize === '4x5') pairCount = 10;
    if (boardSize === '4x6') pairCount = 12;
    if (boardSize === '5x6') pairCount = 15;
    if (boardSize === '6x6') pairCount = 18;

    const selectedPairs = themeDef.pairs.slice(0, pairCount);
    const cardDeck: CardItem[] = [];

    selectedPairs.forEach((pair, idx) => {
      const img = getIllustrationUrl(pair.pairId, pair.symbol, pair.name, pair.color);
      cardDeck.push({
        id: `card_${idx}_a`,
        pairId: pair.pairId,
        symbol: pair.symbol,
        name: pair.name,
        imageUrl: img,
        color: pair.color,
        isFlipped: false,
        isMatched: false,
      });
      cardDeck.push({
        id: `card_${idx}_b`,
        pairId: pair.pairId,
        symbol: pair.symbol,
        name: pair.name,
        imageUrl: img,
        color: pair.color,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Fisher-Yates Shuffle
    for (let i = cardDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]];
    }

    setCards(cardDeck);
    cardsRef.current = cardDeck;
    botMemoryRef.current = [];
    currentTurnCountRef.current = 1;
    isBotRunningRef.current = false;
    setIsBotThinking(false);

    // Start Timer
    timerRef.current = window.setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [boardSize, themeId]);

  // Log flipped cards to Bot memory
  const logCardToMemory = (card: CardItem) => {
    const existingIndex = botMemoryRef.current.findIndex((m) => m.cardId === card.id);
    if (existingIndex >= 0) {
      botMemoryRef.current[existingIndex].seenAtTurn = currentTurnCountRef.current;
    } else {
      botMemoryRef.current.push({
        cardId: card.id,
        pairId: card.pairId,
        seenAtTurn: currentTurnCountRef.current,
      });
    }
  };

  // Turn Match Evaluation Logic for Human Players
  const evaluateMatch = useCallback(
    (card1Id: string, card2Id: string, currentDeck: CardItem[]) => {
      setIsChecking(true);
      setTotalMoves((prev) => prev + 1);
      currentTurnCountRef.current += 1;

      const card1 = currentDeck.find((c) => c.id === card1Id);
      const card2 = currentDeck.find((c) => c.id === card2Id);

      if (!card1 || !card2) {
        setIsChecking(false);
        return;
      }

      const isMatch = card1.pairId === card2.pairId;

      if (isMatch) {
        soundManager.playMatch(comboStreak, sfxEnabled, sfxVolume);

        if ('vibrate' in navigator) {
          try {
            navigator.vibrate(25);
          } catch {
            // ignore vibration error in iframe
          }
        }

        const newStreak = comboStreak + 1;
        setComboStreak(newStreak);
        if (newStreak > highestCombo) setHighestCombo(newStreak);

        setTimeout(() => {
          setCards((deck) => {
            const next = deck.map((c) =>
              c.id === card1Id || c.id === card2Id
                ? { ...c, isMatched: true, matchedByPlayerId: players[activePlayerIndex]?.id }
                : c
            );
            cardsRef.current = next;
            return next;
          });

          setPlayers((prev) => {
            const updated = [...prev];
            if (updated[activePlayerIndex]) {
              updated[activePlayerIndex].score += 1;
              updated[activePlayerIndex].matches += 1;
            }
            return updated;
          });

          setFlippedCardIds([]);
          setIsChecking(false);
          isBotRunningRef.current = false;
          setSuccessfulMatchesCount((prev) => {
            const newCount = prev + 1;
            const totalPairs = currentDeck.length / 2;
            if (newCount >= totalPairs) {
              handleVictoryTrigger(currentDeck);
            }
            return newCount;
          });
        }, 160);
      } else {
        soundManager.playMismatch(sfxEnabled, sfxVolume);
        setComboStreak(1);
        setMismatchingCardIds([card1Id, card2Id]);

        setTimeout(() => {
          setCards((deck) => {
            const next = deck.map((c) => (c.id === card1Id || c.id === card2Id ? { ...c, isFlipped: false } : c));
            cardsRef.current = next;
            return next;
          });
          setFlippedCardIds([]);
          setMismatchingCardIds([]);
          setIsChecking(false);
          isBotRunningRef.current = false;

          // Pass turn to next player
          setActivePlayerIndex((prev) => (prev + 1) % players.length);
        }, 500);
      }
    },
    [activePlayerIndex, comboStreak, highestCombo, players, sfxEnabled, sfxVolume]
  );

  // Card Tap Handler
  const handleCardClick = (cardId: string) => {
    // Block clicks during checking, when bot is thinking, when 2 cards are flipped, or when active player is Bot
    if (isChecking || isBotThinking || flippedCardIds.length >= 2 || players[activePlayerIndex]?.isBot) return;

    const targetCard = cards.find((c) => c.id === cardId);
    if (!targetCard || targetCard.isFlipped || targetCard.isMatched) return;

    soundManager.playFlip(sfxEnabled, sfxVolume);

    const updatedCards = cards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);
    cardsRef.current = updatedCards;
    logCardToMemory(targetCard);

    const newFlipped = [...flippedCardIds, cardId];
    setFlippedCardIds(newFlipped);

    if (newFlipped.length === 2) {
      evaluateMatch(newFlipped[0], newFlipped[1], updatedCards);
    }
  };

  // Victory Trigger
  const handleVictoryTrigger = (finalDeck: CardItem[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    soundManager.playVictory(sfxEnabled, sfxVolume);

    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0] || players[0];

    const totalPairs = finalDeck.length / 2;
    const accuracy = totalMoves > 0 ? Math.round((totalPairs / Math.max(totalMoves, 1)) * 100) : 100;

    onGameOver({
      players,
      winner,
      totalMoves: totalMoves + 1,
      timerSeconds,
      highestCombo,
      accuracyPercentage: accuracy,
    });
  };

  // Bot Card Selection Helpers
  const pickBotCard1 = (unmatched: CardItem[], difficulty: string): CardItem => {
    if (difficulty === 'IMPOSSIBLE' || difficulty === 'HARD') {
      const knownPair = findKnownPairInMemory(unmatched, difficulty);
      if (knownPair) return knownPair.card1;
    }

    if (difficulty === 'MEDIUM' && Math.random() < 0.5) {
      const knownPair = findKnownPairInMemory(unmatched, 'MEDIUM');
      if (knownPair) return knownPair.card1;
    }

    const randomIndex = Math.floor(Math.random() * unmatched.length);
    return unmatched[randomIndex];
  };

  const pickBotCard2 = (card1: CardItem, remaining: CardItem[], difficulty: string): CardItem => {
    if (difficulty === 'IMPOSSIBLE') {
      const match = remaining.find((c) => c.pairId === card1.pairId);
      if (match) return match;
    }

    if (difficulty === 'HARD' || difficulty === 'MEDIUM') {
      const memoryMatch = botMemoryRef.current.find(
        (m) => m.pairId === card1.pairId && m.cardId !== card1.id
      );
      if (memoryMatch) {
        const found = remaining.find((c) => c.id === memoryMatch.cardId);
        const recallChance = difficulty === 'HARD' ? 0.85 : 0.5;
        if (found && Math.random() < recallChance) {
          return found;
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * remaining.length);
    return remaining[randomIndex];
  };

  const findKnownPairInMemory = (unmatched: CardItem[], difficulty: string) => {
    const memory = botMemoryRef.current;
    if (difficulty === 'IMPOSSIBLE') {
      for (let i = 0; i < unmatched.length; i++) {
        for (let j = i + 1; j < unmatched.length; j++) {
          if (unmatched[i].pairId === unmatched[j].pairId) {
            return { card1: unmatched[i], card2: unmatched[j] };
          }
        }
      }
    } else {
      const seenCardIds = new Set(memory.map((m) => m.cardId));
      const remembered = unmatched.filter((c) => seenCardIds.has(c.id));
      for (let i = 0; i < remembered.length; i++) {
        for (let j = i + 1; j < remembered.length; j++) {
          if (remembered[i].pairId === remembered[j].pairId) {
            return { card1: remembered[i], card2: remembered[j] };
          }
        }
      }
    }
    return null;
  };

  // BOT AI SINGLE ASYNC STATE MACHINE
  const runBotTurn = useCallback(async () => {
    if (isBotRunningRef.current) return;
    isBotRunningRef.current = true;
    setIsBotThinking(true);

    console.log('BOT TURN START');

    // Wait 300ms
    await sleep(300);

    const availableCards = cardsRef.current.filter((c) => !c.isMatched && !c.isFlipped);
    if (availableCards.length < 2) {
      console.log('BOT TURN END');
      setIsBotThinking(false);
      isBotRunningRef.current = false;
      return;
    }

    const activePlayer = playersRef.current[activePlayerIndexRef.current];
    const difficulty = activePlayer?.botDifficulty || 'MEDIUM';

    // Choose FIRST card
    const card1 = pickBotCard1(availableCards, difficulty);
    if (!card1) {
      console.log('BOT TURN END');
      setIsBotThinking(false);
      isBotRunningRef.current = false;
      return;
    }

    console.log('FIRST CARD SELECTED');

    // Flip card 1
    soundManager.playFlip(sfxEnabledRef.current, sfxVolumeRef.current);
    logCardToMemory(card1);

    const deckAfterFlip1 = cardsRef.current.map((c) =>
      c.id === card1.id ? { ...c, isFlipped: true } : c
    );
    setCards(deckAfterFlip1);
    cardsRef.current = deckAfterFlip1;
    setFlippedCardIds([card1.id]);

    // Wait 500ms
    await sleep(500);

    // Choose SECOND card
    const remaining = cardsRef.current.filter(
      (c) => !c.isMatched && !c.isFlipped && c.id !== card1.id
    );

    let card2 = pickBotCard2(card1, remaining, difficulty);

    // Fallback: If Bot cannot find a valid second card, choose a random unrevealed card
    if (!card2 && remaining.length > 0) {
      const randomIndex = Math.floor(Math.random() * remaining.length);
      card2 = remaining[randomIndex];
    }

    if (!card2) {
      console.log('BOT TURN END');
      setIsBotThinking(false);
      isBotRunningRef.current = false;
      return;
    }

    console.log('SECOND CARD SELECTED');

    // Flip card 2
    soundManager.playFlip(sfxEnabledRef.current, sfxVolumeRef.current);
    logCardToMemory(card2);

    const deckAfterFlip2 = cardsRef.current.map((c) =>
      c.id === card2.id ? { ...c, isFlipped: true } : c
    );
    setCards(deckAfterFlip2);
    cardsRef.current = deckAfterFlip2;
    setFlippedCardIds([card1.id, card2.id]);

    setTotalMoves((prev) => prev + 1);
    currentTurnCountRef.current += 1;

    // Evaluate Match
    const isMatch = card1.pairId === card2.pairId;

    if (isMatch) {
      console.log('MATCH');
      soundManager.playMatch(comboStreakRef.current, sfxEnabledRef.current, sfxVolumeRef.current);

      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(25);
        } catch {
          // ignore iframe vibration restriction
        }
      }

      const newStreak = comboStreakRef.current + 1;
      setComboStreak(newStreak);
      if (newStreak > highestComboRef.current) {
        setHighestCombo(newStreak);
      }

      const currentBotId = playersRef.current[activePlayerIndexRef.current]?.id;
      const matchedDeck = cardsRef.current.map((c) =>
        c.id === card1.id || c.id === card2.id
          ? { ...c, isMatched: true, matchedByPlayerId: currentBotId }
          : c
      );
      setCards(matchedDeck);
      cardsRef.current = matchedDeck;

      setPlayers((prev) => {
        const updated = [...prev];
        const pIdx = activePlayerIndexRef.current;
        if (updated[pIdx]) {
          updated[pIdx] = {
            ...updated[pIdx],
            score: updated[pIdx].score + 1,
            matches: updated[pIdx].matches + 1,
          };
        }
        return updated;
      });

      setFlippedCardIds([]);

      let isGameOver = false;
      setSuccessfulMatchesCount((prev) => {
        const newCount = prev + 1;
        const totalPairs = matchedDeck.length / 2;
        if (newCount >= totalPairs) {
          isGameOver = true;
          handleVictoryTrigger(matchedDeck);
        }
        return newCount;
      });

      if (isGameOver) {
        setIsBotThinking(false);
        isBotRunningRef.current = false;
        return;
      }

      // Wait 700ms before bot starts another turn
      await sleep(700);

      isBotRunningRef.current = false;
      runBotTurn();
    } else {
      console.log('MISMATCH');
      soundManager.playMismatch(sfxEnabledRef.current, sfxVolumeRef.current);
      setComboStreak(1);
      setMismatchingCardIds([card1.id, card2.id]);

      // Wait 900ms
      await sleep(900);

      // Flip both cards back
      const flippedBackDeck = cardsRef.current.map((c) =>
        c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
      );
      setCards(flippedBackDeck);
      cardsRef.current = flippedBackDeck;
      setFlippedCardIds([]);
      setMismatchingCardIds([]);

      console.log('BOT TURN END');

      // Switch to human / next player
      setActivePlayerIndex((prev) => (prev + 1) % playersRef.current.length);

      setIsBotThinking(false);
      isBotRunningRef.current = false;
    }
  }, []);

  // BOT AI TRIGGER
  useEffect(() => {
    const activePlayer = players[activePlayerIndex];
    if (activePlayer?.isBot && !isChecking && !isBotRunningRef.current) {
      runBotTurn();
    }
  }, [activePlayerIndex, players, isChecking, runBotTurn]);

  // Determine grid template columns
  let gridColsClass = 'grid-cols-4';
  if (boardSize === '5x6') gridColsClass = 'grid-cols-5';
  if (boardSize === '6x6') gridColsClass = 'grid-cols-6';

  const themeCardBack = GAME_THEMES[themeId]?.cardBackGradient || 'from-amber-300 to-yellow-400';

  return (
    <div className="flex-1 w-full flex flex-col justify-between select-none relative z-10 h-full overflow-hidden">
      {/* TOP COMPACT STATUS BAR */}
      <Header
        players={players}
        activePlayerIndex={activePlayerIndex}
        timerSeconds={timerSeconds}
        onPause={onPause}
        colorScheme={colorScheme}
      />

      {/* 90-95% SCREEN COVERAGE CARDS DISPLAY BOARD */}
      <div className="flex-1 w-full max-w-xl mx-auto p-2 sm:p-3 flex items-center justify-center my-auto min-h-0 overflow-hidden">
        <div className={`w-full h-full grid ${gridColsClass} gap-2 sm:gap-2.5 items-center justify-center max-h-full ${(isBotThinking || players[activePlayerIndex]?.isBot) ? 'pointer-events-none' : ''}`}>
          {cards.map((card) => (
            <Card3D
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
              disabled={isChecking || isBotThinking || players[activePlayerIndex]?.isBot || false}
              themeCardBack={themeCardBack}
              themeId={themeId}
              flipSpeedMs={flipSpeedMs}
              isMismatching={mismatchingCardIds.includes(card.id)}
              colorScheme={colorScheme}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
