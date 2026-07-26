import React from 'react';

interface CardIllustrationProps {
  pairId: string;
  symbol: string;
  name: string;
  color: string; // Tailwind gradient like 'from-amber-400 to-orange-500'
  themeId?: string;
}

/**
 * Returns color stops for gradient based on Tailwind class string
 */
const getGradientStops = (colorStr: string): [string, string] => {
  if (colorStr.includes('rose') || colorStr.includes('pink')) return ['#f43f5e', '#e11d48'];
  if (colorStr.includes('red')) return ['#ef4444', '#b91c1c'];
  if (colorStr.includes('orange')) return ['#f97316', '#c2410c'];
  if (colorStr.includes('amber') || colorStr.includes('yellow')) return ['#f59e0b', '#d97706'];
  if (colorStr.includes('lime') || colorStr.includes('green')) return ['#84cc16', '#15803d'];
  if (colorStr.includes('emerald') || colorStr.includes('teal')) return ['#10b981', '#0f766e'];
  if (colorStr.includes('cyan') || colorStr.includes('sky')) return ['#06b6d4', '#0369a1'];
  if (colorStr.includes('blue')) return ['#3b82f6', '#1d4ed8'];
  if (colorStr.includes('indigo') || colorStr.includes('purple')) return ['#6366f1', '#4338ca'];
  if (colorStr.includes('fuchsia') || colorStr.includes('violet')) return ['#d946ef', '#7e22ce'];
  if (colorStr.includes('stone') || colorStr.includes('zinc')) return ['#64748b', '#334155'];
  return ['#f59e0b', '#ea580c'];
};

export const CardIllustration: React.FC<CardIllustrationProps> = ({
  pairId,
  symbol,
  color,
  themeId = '',
}) => {
  const [c1, c2] = getGradientStops(color);

  // Debug logging for asset verification
  React.useEffect(() => {
    console.log(`[Card Illustration] Rendered vector card artwork: theme="${themeId}", pairId="${pairId}", symbol="${symbol}"`);
  }, [themeId, pairId, symbol]);

  // Generate unique vector artwork based on theme category
  const renderVectorGraphics = () => {
    // 1. SPACE & PLANETS
    if (themeId.includes('space') || themeId.includes('planet') || themeId.includes('astro') || themeId.includes('alien')) {
      return (
        <g filter="url(#dropShadow)">
          {/* Orbit Rings */}
          <ellipse cx="200" cy="200" rx="145" ry="52" fill="none" stroke="#ffffff" strokeWidth="6" strokeOpacity="0.4" transform="rotate(-25 200 200)" />
          {/* Main Sphere Badge */}
          <circle cx="200" cy="200" r="105" fill="url(#coreGlow)" />
          <circle cx="200" cy="200" r="85" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" strokeWidth="4" />
          <text x="200" y="215" fontSize="100" textAnchor="middle" dominantBaseline="middle">{symbol}</text>
          {/* Front Orbit overlay */}
          <path d="M 55 215 A 145 52 0 0 0 345 185" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.85" transform="rotate(-25 200 200)" />
        </g>
      );
    }

    // 2. PETS & WILD ANIMALS & BIRDS
    if (themeId.includes('animal') || themeId.includes('bird') || themeId.includes('pet')) {
      return (
        <g filter="url(#dropShadow)">
          <circle cx="200" cy="200" r="120" fill="#ffffff" fillOpacity="0.25" />
          <circle cx="200" cy="200" r="95" fill="url(#coreGlow)" stroke="#ffffff" strokeWidth="5" />
          <text x="200" y="215" fontSize="110" textAnchor="middle" dominantBaseline="middle">{symbol}</text>
        </g>
      );
    }

    // 3. VEHICLES & CARS
    if (themeId.includes('vehicle') || themeId.includes('car')) {
      return (
        <g filter="url(#dropShadow)">
          <rect x="60" y="100" width="280" height="200" rx="40" fill="url(#coreGlow)" stroke="#ffffff" strokeWidth="6" />
          <circle cx="200" cy="200" r="80" fill="#ffffff" fillOpacity="0.3" />
          <text x="200" y="215" fontSize="110" textAnchor="middle" dominantBaseline="middle">{symbol}</text>
        </g>
      );
    }

    // 4. FOOD & SWEETS
    if (themeId.includes('food') || themeId.includes('sweet') || themeId.includes('cook')) {
      return (
        <g filter="url(#dropShadow)">
          <circle cx="200" cy="200" r="120" fill="#ffffff" fillOpacity="0.25" />
          <circle cx="200" cy="200" r="95" fill="url(#coreGlow)" stroke="#ffffff" strokeWidth="5" />
          <text x="200" y="215" fontSize="110" textAnchor="middle" dominantBaseline="middle">{symbol}</text>
        </g>
      );
    }

    // 5. INDIAN CULTURE & FESTIVALS & MYTHOLOGY
    if (themeId.includes('indian') || themeId.includes('festival') || themeId.includes('mythology') || themeId.includes('culture')) {
      return (
        <g filter="url(#dropShadow)">
          <circle cx="200" cy="200" r="125" fill="none" stroke="#ffffff" strokeWidth="5" strokeDasharray="18 12" strokeOpacity="0.8" />
          <circle cx="200" cy="200" r="98" fill="url(#coreGlow)" stroke="#ffffff" strokeWidth="5" />
          <text x="200" y="215" fontSize="110" textAnchor="middle" dominantBaseline="middle">{symbol}</text>
        </g>
      );
    }

    // 6. FANTASY & DRAGONS & FAIRIES
    if (themeId.includes('fantasy') || themeId.includes('dragon') || themeId.includes('fair')) {
      return (
        <g filter="url(#dropShadow)">
          <polygon points="200,60 320,200 200,340 80,200" fill="url(#coreGlow)" stroke="#ffffff" strokeWidth="6" />
          <circle cx="200" cy="200" r="75" fill="#ffffff" fillOpacity="0.3" />
          <text x="200" y="215" fontSize="105" textAnchor="middle" dominantBaseline="middle">{symbol}</text>
        </g>
      );
    }

    // DEFAULT COLLECTIBLE PICTURE CARD ARTWORK (SPORTS, GAMING, LOGOS, EMOJIS, ETC.)
    return (
      <g filter="url(#dropShadow)">
        <rect x="75" y="75" width="250" height="250" rx="55" fill="url(#coreGlow)" stroke="#ffffff" strokeWidth="6" />
        <circle cx="200" cy="200" r="85" fill="#ffffff" fillOpacity="0.25" />
        <text x="200" y="215" fontSize="115" textAnchor="middle" dominantBaseline="middle">{symbol}</text>
      </g>
    );
  };

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden select-none flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full object-cover rounded-xl shadow-inner pointer-events-none"
      >
        <defs>
          <linearGradient id={`bg_${pairId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>

          <radialGradient id={`glow_${pairId}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="coreGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
          </linearGradient>

          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. Full-Bleed Gradient Card Canvas */}
        <rect width="400" height="400" rx="32" fill={`url(#bg_${pairId})`} />

        {/* 2. Top Radial Lighting Glow */}
        <rect width="400" height="400" rx="32" fill={`url(#glow_${pairId})`} />

        {/* 3. Outer Frame Border */}
        <rect
          x="14"
          y="14"
          width="372"
          height="372"
          rx="24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeOpacity="0.5"
        />

        {/* 4. Large Subject Emblem Artwork */}
        {renderVectorGraphics()}

        {/* 5. Top Glass Shine Overlay */}
        <path
          d="M 14 14 L 386 14 L 386 130 C 250 170, 150 170, 14 130 Z"
          fill="#ffffff"
          fillOpacity="0.22"
        />
      </svg>
    </div>
  );
};
