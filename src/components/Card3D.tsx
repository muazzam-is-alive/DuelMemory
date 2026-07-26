import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CardItem, ColorScheme } from '../types';
import { CardIllustration } from './CardIllustration';

interface Card3DProps {
  card: CardItem;
  onClick: () => void;
  disabled: boolean;
  themeCardBack: string;
  themeId?: string;
  flipSpeedMs?: number; // target 180ms
  isMismatching?: boolean;
  colorScheme?: ColorScheme;
}

export const Card3D: React.FC<Card3DProps> = ({
  card,
  onClick,
  disabled,
  themeCardBack,
  themeId,
  flipSpeedMs = 180,
  isMismatching = false,
  colorScheme = 'BRIGHT',
}) => {
  const isBright = colorScheme === 'BRIGHT';
  const isPink = colorScheme === 'NEON_PINK';
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [card.id, card.imageUrl]);

  return (
    <div
      className="relative w-full h-full aspect-square perspective-1000 cursor-pointer touch-manipulation active:scale-[0.97] transition-transform select-none"
      onClick={() => {
        if (!disabled && !card.isFlipped && !card.isMatched) {
          onClick();
        }
      }}
    >
      <motion.div
        className={`w-full h-full relative rounded-2xl transform-style-3d shadow-md transition-shadow ${
          card.isMatched
            ? isBright
              ? 'ring-4 ring-emerald-400 shadow-emerald-200/80 shadow-lg'
              : isPink
              ? 'ring-4 ring-pink-400 shadow-pink-300/80 shadow-lg'
              : 'ring-2 ring-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.7)]'
            : isMismatching
            ? 'ring-4 ring-rose-500 shadow-rose-300 shadow-lg'
            : isBright
            ? 'hover:shadow-xl border border-slate-200/60'
            : isPink
            ? 'hover:shadow-[0_4px_20px_rgba(244,114,182,0.35)] border border-pink-200/80'
            : 'hover:shadow-[0_0_18px_rgba(168,85,247,0.5)]'
        }`}
        animate={{
          rotateY: card.isFlipped || card.isMatched ? 180 : 0,
          scale: card.isMatched ? [1, 1.05, 1] : 1,
          x: isMismatching ? [-5, 5, -3, 3, 0] : 0,
        }}
        transition={{
          rotateY: { duration: flipSpeedMs / 1000, ease: [0.2, 0.9, 0.3, 1] },
          x: { duration: 0.18 },
          scale: { duration: 0.16 },
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* CARD BACK (Face Down - Unflipped) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl p-1.5 flex flex-col items-center justify-center backface-hidden overflow-hidden border shadow-inner ${
            isBright
              ? 'bg-gradient-to-br from-amber-300 via-orange-300 to-yellow-400 border-amber-200/90 shadow-amber-500/10'
              : isPink
              ? 'bg-gradient-to-br from-pink-200 via-rose-100 to-pink-300 border-pink-300/90 shadow-pink-200/50'
              : `bg-gradient-to-br ${themeCardBack} border-purple-500/40`
          }`}
        >
          {/* Inner Photo Border Pattern */}
          <div
            className={`absolute inset-1.5 rounded-xl border flex items-center justify-center ${
              isBright
                ? 'border-amber-400/60 bg-white/40 backdrop-blur-[2px]'
                : isPink
                ? 'border-pink-300/80 bg-white/60 backdrop-blur-[2px]'
                : 'border-purple-400/30 bg-purple-950/30'
            }`}
          >
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center shadow-sm ${
                isBright
                  ? 'border-amber-500/40 bg-white/80 text-amber-600'
                  : isPink
                  ? 'border-pink-400/60 bg-pink-100 text-pink-500'
                  : 'border-purple-400/40 bg-purple-500/20'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rotate-45 border ${
                  isBright
                    ? 'border-amber-500 bg-amber-400'
                    : isPink
                    ? 'border-pink-400 bg-pink-400'
                    : 'border-cyan-400 bg-cyan-400/60'
                }`}
              />
            </div>
          </div>
        </div>

        {/* CARD FRONT (Face Up - Large Collectible Picture Card - NO TEXT) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl flex items-center justify-center backface-hidden overflow-hidden shadow-md ${
            isBright
              ? 'bg-white border-2 border-slate-200/90'
              : isPink
              ? 'bg-white border-2 border-pink-200'
              : `bg-gradient-to-br ${card.color} border border-white/30`
          }`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          {card.imageUrl && !imgError ? (
            <div className="relative w-full h-full p-1 sm:p-1.5 flex items-center justify-center bg-slate-50">
              <img
                key={card.id}
                src={card.imageUrl}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => {
                  console.error(`[Card Image ERROR] Asset not found or failed to load: theme="${themeId}", card="${card.name}", path="${card.imageUrl}" -> Falling back to vector illustration`);
                  setImgError(true);
                }}
                onLoad={() => {
                  console.log(`[Card Image SUCCESS] Loaded successfully: theme="${themeId}", card="${card.name}", path="${card.imageUrl}"`);
                }}
                className="w-full h-full object-cover rounded-xl shadow-inner transition-transform duration-300 hover:scale-105 pointer-events-none"
              />
              <div className="absolute inset-1 sm:inset-1.5 rounded-xl border border-black/10 pointer-events-none" />
            </div>
          ) : (
            <div className="relative w-full h-full p-0.5 sm:p-1">
              <CardIllustration
                pairId={card.pairId}
                symbol={card.symbol}
                name={card.name}
                color={card.color}
                themeId={themeId}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};


