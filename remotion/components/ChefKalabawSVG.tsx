import React from 'react';
import { useCurrentFrame } from 'remotion';

interface ChefKalabawSVGProps {
  size?: number;
  winking?: boolean;
}

export const ChefKalabawSVG: React.FC<ChefKalabawSVGProps> = ({
  size = 320,
  winking = true,
}) => {
  const frame = useCurrentFrame();

  // Gentle head & body breathing bob
  const bodyY = Math.sin(frame * 0.1) * 3;
  // Stirring arm rotation
  const stirAngle = Math.sin(frame * 0.2) * 12;
  // Steam wisp drift
  const steamY1 = ((frame * 1.5) % 30);
  const steamY2 = (((frame * 1.5) + 12) % 30);

  return (
    <div
      style={{
        width: size,
        height: size * 0.95,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))',
      }}
    >
      <svg
        viewBox="0 0 200 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="kalabawPalayokGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#D97706" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="kalabawPalayokBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E25C3E" />
            <stop offset="28%" stopColor="#C84B31" />
            <stop offset="70%" stopColor="#9C341D" />
            <stop offset="100%" stopColor="#6E2010" />
          </linearGradient>

          <linearGradient id="kalabawPalayokRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EA694B" />
            <stop offset="50%" stopColor="#B63F26" />
            <stop offset="100%" stopColor="#752210" />
          </linearGradient>

          <radialGradient id="kalabawStewBrothGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </radialGradient>

          <linearGradient id="kalabawSandokWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBA8C" />
            <stop offset="50%" stopColor="#B38150" />
            <stop offset="100%" stopColor="#7A4E26" />
          </linearGradient>

          <linearGradient id="kalabawHornLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#755642" />
            <stop offset="35%" stopColor="#4A3427" />
            <stop offset="75%" stopColor="#2E1F16" />
            <stop offset="100%" stopColor="#1A110B" />
          </linearGradient>

          <linearGradient id="kalabawHornRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#755642" />
            <stop offset="35%" stopColor="#4A3427" />
            <stop offset="75%" stopColor="#2E1F16" />
            <stop offset="100%" stopColor="#1A110B" />
          </linearGradient>

          <radialGradient id="kalabawHeadGrad2" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#635B52" />
            <stop offset="55%" stopColor="#4A433B" />
            <stop offset="100%" stopColor="#302B25" />
          </radialGradient>

          <radialGradient id="kalabawMuzzleGrad2" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#82776A" />
            <stop offset="60%" stopColor="#665D52" />
            <stop offset="100%" stopColor="#484037" />
          </radialGradient>

          <linearGradient id="kalabawGoldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="kalabawToqueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F5EFE6" />
            <stop offset="100%" stopColor="#DBD4C7" />
          </linearGradient>

          <linearGradient id="kalabawBandanaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E64A2E" />
            <stop offset="55%" stopColor="#C8381E" />
            <stop offset="100%" stopColor="#8C1F0B" />
          </linearGradient>

          <linearGradient id="kalabawSteamSoftGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#FAF6EE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="115" r="75" fill="url(#kalabawPalayokGlow)" />

        {/* Dynamic Steam Curves */}
        <g transform={`translate(0, ${-steamY1 * 0.4})`}>
          <path
            d="M92 110 C86 98 96 86 90 74 C86 64 92 56 88 48"
            stroke="url(#kalabawSteamSoftGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <g transform={`translate(0, ${-steamY2 * 0.4})`}>
          <path
            d="M106 112 C112 100 102 88 108 76 C114 66 108 58 112 50"
            stroke="url(#kalabawSteamSoftGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Main Cooking Assembly */}
        <g transform={`translate(0, ${bodyY})`}>
          {/* Chef Body */}
          <path
            d="M56 150 C56 108 72 98 100 98 C128 98 144 108 144 150 Z"
            fill="url(#kalabawHeadGrad2)"
            stroke="#26221C"
            strokeWidth="1"
          />

          {/* Apron */}
          <path
            d="M68 110 L132 110 L138 152 L62 152 Z"
            fill="#F9F6EE"
            stroke="#D4CDBC"
            strokeWidth="1.2"
          />
          <path d="M68 111 L132 111" stroke="#2D6A4F" strokeWidth="2.2" strokeLinecap="round" />

          {/* Bandana */}
          <path
            d="M84 102 L116 102 L100 118 Z"
            fill="url(#kalabawBandanaGrad)"
            stroke="#781706"
            strokeWidth="1"
          />
          <circle cx="100" cy="104" r="3.2" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />

          {/* Head & Face */}
          <g>
            {/* Horns */}
            <path
              d="M78 68 C58 58 40 36 54 20 C64 8 82 24 90 44 Z"
              fill="url(#kalabawHornLeftGrad)"
              stroke="#261A13"
              strokeWidth="1.4"
            />
            <path
              d="M122 68 C142 58 160 36 146 20 C136 8 118 24 110 44 Z"
              fill="url(#kalabawHornRightGrad)"
              stroke="#261A13"
              strokeWidth="1.4"
            />

            {/* Ears */}
            <ellipse cx="64" cy="72" rx="14" ry="7.5" transform="rotate(-18 64 72)" fill="#443D36" stroke="#2B2620" strokeWidth="1" />
            <ellipse cx="64" cy="72" rx="9" ry="4.5" transform="rotate(-18 64 72)" fill="#C28A62" opacity="0.75" />

            <ellipse cx="136" cy="72" rx="14" ry="7.5" transform="rotate(18 136 72)" fill="#443D36" stroke="#2B2620" strokeWidth="1" />
            <ellipse cx="136" cy="72" rx="9" ry="4.5" transform="rotate(18 136 72)" fill="#C28A62" opacity="0.75" />

            {/* Face base */}
            <ellipse cx="100" cy="74" rx="28" ry="24" fill="url(#kalabawHeadGrad2)" stroke="#26221C" strokeWidth="1" />
            <ellipse cx="100" cy="85" rx="20" ry="14" fill="url(#kalabawMuzzleGrad2)" stroke="#38322B" strokeWidth="1" />

            {/* Nostrils & Smile */}
            <ellipse cx="91.5" cy="84.5" rx="3.6" ry="4.6" fill="#1C1814" />
            <ellipse cx="108.5" cy="84.5" rx="3.6" ry="4.6" fill="#1C1814" />
            <path d="M93 92 Q100 96 107 92" stroke="#2B241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Gold Nose Ring */}
            <path
              d="M93 89 C93 100 107 100 107 89"
              stroke="url(#kalabawGoldRingGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="100" cy="98" r="1" fill="#FFFFFF" />

            {/* Left Eye */}
            <circle cx="87.5" cy="68" r="4.8" fill="#15120F" />
            <circle cx="86" cy="66.5" r="1.8" fill="#FFFFFF" />
            <path d="M83 61 Q88 58 93 61" stroke="#2A241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Right Eye (Winking or Open) */}
            {winking ? (
              <g>
                <path d="M106 68 Q112 62 118 68" stroke="#15120F" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M107 60 Q112 57 117 60" stroke="#2A241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              <g>
                <circle cx="112.5" cy="68" r="4.8" fill="#15120F" />
                <circle cx="111" cy="66.5" r="1.8" fill="#FFFFFF" />
                <path d="M107 61 Q112 58 117 61" stroke="#2A241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Rosy Cheeks */}
            <ellipse cx="78.5" cy="78" rx="5" ry="2.8" fill="#E2725B" opacity="0.55" />
            <ellipse cx="121.5" cy="78" rx="5" ry="2.8" fill="#E2725B" opacity="0.55" />

            {/* Chef's Toque Hat */}
            <g>
              <rect x="80" y="44" width="40" height="9" rx="3" fill="#FFFFFF" stroke="#D1C8B8" strokeWidth="1.4" />
              <path
                d="M80 44 C74 34 78 22 90 22 C93 14 107 14 110 22 C122 22 126 34 120 44 Z"
                fill="url(#kalabawToqueGrad)"
                stroke="#C9C0AF"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </g>
          </g>

          {/* Left Arm holding pot */}
          <g>
            <path
              d="M62 110 C50 118 46 134 56 142 C64 146 72 138 72 130 C72 122 68 114 62 110 Z"
              fill="url(#kalabawHeadGrad2)"
              stroke="#26221C"
              strokeWidth="1"
            />
          </g>

          {/* Palayok Pot Assembly */}
          <g>
            <ellipse cx="100" cy="155" rx="42" ry="7.5" fill="rgba(32, 19, 14, 0.22)" />
            <path d="M66 128 C56 128 56 138 66 138" stroke="#A83920" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M134 128 C144 128 144 138 134 138" stroke="#A83920" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path
              d="M66 125 C64 146 78 154 100 154 C122 154 136 146 134 125 Z"
              fill="url(#kalabawPalayokBodyGrad)"
              stroke="#6B1D0E"
              strokeWidth="1.8"
            />
            <ellipse cx="100" cy="125.5" rx="34" ry="7" fill="url(#kalabawPalayokRimGrad)" stroke="#5E190B" strokeWidth="1.2" />
            <ellipse cx="100" cy="125.5" rx="30" ry="5.6" fill="url(#kalabawStewBrothGrad)" />
          </g>

          {/* Animated Right Arm & Wooden Sandok (Ladle) */}
          <g
            style={{
              transformOrigin: '136px 110px',
              transform: `rotate(${stirAngle}deg)`,
            }}
          >
            <path
              d="M136 110 C146 118 138 132 126 128 C118 124 116 114 126 108 Z"
              fill="url(#kalabawHeadGrad2)"
              stroke="#26221C"
              strokeWidth="1"
            />
            <path
              d="M128 92 L104 128"
              stroke="url(#kalabawSandokWoodGrad)"
              strokeWidth="4.2"
              strokeLinecap="round"
            />
            <ellipse cx="102" cy="129" rx="4.5" ry="3.5" fill="#A87545" transform="rotate(-30 102 129)" />
          </g>
        </g>
      </svg>
    </div>
  );
};
