import { motion } from 'motion/react'

// Moods follow the loading steps: reading your list, finding matches, then stirring while the AI writes.
export type KalabawMood = 'idle' | 'excited' | 'stir'

interface ChefKalabawProps {
  mood: KalabawMood
  size?: number
  // Each new value gives the spoon a stir (when the pot is tapped).
  stirKey?: number
  className?: string
}

// Chef Kalabaw, a carabao: wide backward-curving horns, slate-grey coat, tan muzzle, chef hat and apron.
// One shared drawing on a 200 × 200 grid. Steam and blinking loop in CSS (.kalabaw-steam, .kalabaw-eyes),
// only when the visitor allows motion. Decorative: callers give the context.
const coat = '#66707C'
const coatDark = '#525B66'
const ink = '#2B1D16'
const blush = '#E79E92'
const pot = '#B5442A'

export function ChefKalabaw({ mood, size = 120, stirKey, className = '' }: ChefKalabawProps) {
  return (
    <svg className={`chef-kalabaw ${className}`} width={size} height={size} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <ellipse cx="100" cy="194" rx="52" ry="6" fill="rgba(43,29,22,.12)" />

      {/* Horns, behind the head. */}
      <path d="M74 64 C54 70 28 66 16 30 C32 50 54 53 74 49 Z" fill="#3A3431" />
      <path d="M126 64 C146 70 172 66 184 30 C168 50 146 53 126 49 Z" fill="#3A3431" />
      <path d="M60 62 C46 62 34 56 26 44" stroke="#5C524C" strokeWidth="2" fill="none" />
      <path d="M140 62 C154 62 166 56 174 44" stroke="#5C524C" strokeWidth="2" fill="none" />

      {/* Body, apron and scarf. */}
      <path d="M56 198 C56 152 72 136 100 136 C128 136 144 152 144 198 Z" fill={coat} />
      <path d="M76 198 C76 162 85 150 100 150 C115 150 124 162 124 198 Z" fill="#FFFDF7" />
      <rect x="92" y="170" width="16" height="12" rx="3" fill="none" stroke={pot} strokeWidth="2" />
      <path d="M82 138 H118 L100 156 Z" fill={pot} />

      {/* Ears and head. */}
      <ellipse cx="54" cy="86" rx="14" ry="7.5" fill={coat} transform="rotate(-18 54 86)" />
      <ellipse cx="55" cy="86" rx="8" ry="3.8" fill={blush} transform="rotate(-18 55 86)" />
      <ellipse cx="146" cy="86" rx="14" ry="7.5" fill={coat} transform="rotate(18 146 86)" />
      <ellipse cx="145" cy="86" rx="8" ry="3.8" fill={blush} transform="rotate(18 145 86)" />
      <path d="M100 48 C128 48 144 66 144 91 C144 117 127 133 100 133 C73 133 56 117 56 91 C56 66 72 48 100 48 Z" fill={coat} />
      <path d="M92 54 q8 -6 16 0" stroke={coatDark} strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Chef hat. */}
      <g fill="#FFFFFF" stroke="#E3D8CB" strokeWidth="1.5">
        <rect x="78" y="40" width="44" height="12" rx="4" />
        <circle cx="85" cy="32" r="10" />
        <circle cx="115" cy="32" r="10" />
        <circle cx="100" cy="25" r="12.5" />
      </g>
      <rect x="79" y="36" width="42" height="9" fill="#FFFFFF" />

      {/* Face: happy closed eyes when he's found matches, open (blinking) eyes otherwise. */}
      <ellipse cx="100" cy="111" rx="30" ry="19" fill="#D8C2B2" />
      <ellipse cx="90" cy="108" rx="3.6" ry="2.6" fill="#7A5C50" />
      <ellipse cx="110" cy="108" rx="3.6" ry="2.6" fill="#7A5C50" />
      {mood === 'excited' ? (
        <g stroke={ink} strokeWidth="3.5" fill="none" strokeLinecap="round">
          <path d="M77 88 Q84 80 91 88" />
          <path d="M109 88 Q116 80 123 88" />
        </g>
      ) : (
        <g className="kalabaw-eyes">
          <ellipse cx="84" cy="86" rx="5.5" ry="6.5" fill={ink} />
          <ellipse cx="116" cy="86" rx="5.5" ry="6.5" fill={ink} />
          <circle cx="86" cy="83.5" r="2" fill="#FFFFFF" />
          <circle cx="118" cy="83.5" r="2" fill="#FFFFFF" />
        </g>
      )}
      {mood === 'excited'
        ? <path d="M89 117 Q100 132 111 117 Z" fill="#7A3B2E" />
        : <path d="M91 119 Q100 126 109 119" stroke="#5A3E33" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
      <circle cx="70" cy="101" r="6" fill={blush} opacity=".55" />
      <circle cx="130" cy="101" r="6" fill={blush} opacity=".55" />

      {/* The palayok, held in both hands. */}
      <path d="M62 160 H138 C138 180 123 192 100 192 C77 192 62 180 62 160 Z" fill={pot} />
      <rect x="57" y="152" width="86" height="11" rx="5.5" fill="#8F3420" />
      <path d="M76 172 H124" stroke="#D9774F" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      <circle cx="56" cy="160" r="8" fill={coatDark} />
      <circle cx="144" cy="160" r="8" fill={coatDark} />

      {mood !== 'idle' ? (
        <g className="kalabaw-steam" stroke="#D9C9B9" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M88 146 q-5 -7 0 -14" />
          <path d="M112 146 q-5 -7 0 -14" />
        </g>
      ) : null}
      {mood === 'excited' ? (
        <g fill="#F4B33D">
          <path d="M40 70 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" />
          <path d="M160 64 l2.5 5.5 l5.5 2.5 l-5.5 2.5 l-2.5 5.5 l-2.5 -5.5 l-5.5 -2.5 l5.5 -2.5 z" />
        </g>
      ) : null}
      {mood === 'stir' ? (
        <motion.g
          key={stirKey}
          style={{ originX: '104px', originY: '158px' }}
          initial={{ rotate: stirKey ? -14 : 0 }}
          animate={{ rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          <path d="M104 158 L146 118" stroke="#B07A45" strokeWidth="5" strokeLinecap="round" />
          <circle cx="146" cy="118" r="8" fill={coatDark} />
        </motion.g>
      ) : null}
    </svg>
  )
}
