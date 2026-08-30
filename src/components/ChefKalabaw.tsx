import { motion } from 'motion/react'

interface ChefKalabawProps {
  size?: number
  className?: string
}

export function ChefKalabaw({ size = 180, className = '' }: ChefKalabawProps) {
  return (
    <div className={`chef-kalabaw-wrapper ${className}`} style={{ width: size, height: size * 0.95 }}>
      <svg
        viewBox="0 0 200 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="chef-kalabaw-svg"
        aria-hidden="true"
      >
        {/* Ambient Glow */}
        <circle cx="100" cy="115" r="70" fill="var(--mango-3, #FFF4D6)" opacity="0.6" />

        {/* Animated Steam Trails */}
        <motion.g
          animate={{ y: [-2, -8, -2], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M135 75 C132 65 140 58 136 48 C133 40 138 34 135 28"
            stroke="var(--sand-8, #b0a99f)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 3"
            fill="none"
          />
          <path
            d="M150 78 C148 68 155 60 151 52 C148 45 154 38 150 32"
            stroke="var(--palayok-terracotta, #C84B31)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
            fill="none"
          />
        </motion.g>

        {/* ── CHEF KALABAW BODY & HEAD ── */}
        <g className="kalabaw-character">
          {/* Horns */}
          <path
            d="M58 82 C38 72 24 50 36 34 C44 24 60 38 68 56"
            fill="#5C4033"
            stroke="#3A281E"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M102 82 C122 72 136 50 124 34 C116 24 100 38 92 56"
            fill="#5C4033"
            stroke="#3A281E"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Ears */}
          <ellipse cx="44" cy="86" rx="14" ry="7" transform="rotate(-20 44 86)" fill="#4A453E" />
          <ellipse cx="44" cy="86" rx="8" ry="4" transform="rotate(-20 44 86)" fill="#D4A373" opacity="0.6" />
          <ellipse cx="116" cy="86" rx="14" ry="7" transform="rotate(20 116 86)" fill="#4A453E" />
          <ellipse cx="116" cy="86" rx="8" ry="4" transform="rotate(20 116 86)" fill="#D4A373" opacity="0.6" />

          {/* Body / Shoulders */}
          <path
            d="M40 148 C40 125 55 112 80 112 C105 112 120 125 120 148 Z"
            fill="#4A453E"
          />

          {/* Apron */}
          <path
            d="M56 122 L104 122 L110 152 L50 152 Z"
            fill="#FAF6EE"
            stroke="#E0DBD0"
            strokeWidth="1.5"
          />
          {/* Neckerchief (Red Bandana) */}
          <path
            d="M68 114 L92 114 L80 128 Z"
            fill="#C84B31"
          />
          <circle cx="80" cy="116" r="3.5" fill="#F39C12" />

          {/* Head Base */}
          <ellipse cx="80" cy="88" rx="28" ry="24" fill="#4A453E" />

          {/* Snout / Muzzle */}
          <ellipse cx="80" cy="98" rx="20" ry="14" fill="#6B6258" />
          {/* Nostrils */}
          <ellipse cx="72" cy="98" rx="3.5" ry="4.5" fill="#2E2822" />
          <ellipse cx="88" cy="98" rx="3.5" ry="4.5" fill="#2E2822" />
          {/* Golden Nose Ring */}
          <path
            d="M74 103 C74 112 86 112 86 103"
            stroke="#F39C12"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes (Happy Expression) */}
          <circle cx="68" cy="82" r="4.5" fill="#1C1814" />
          <circle cx="66.5" cy="80.5" r="1.5" fill="#FFFFFF" />
          <circle cx="92" cy="82" r="4.5" fill="#1C1814" />
          <circle cx="90.5" cy="80.5" r="1.5" fill="#FFFFFF" />

          {/* Cheerful Blush */}
          <ellipse cx="60" cy="92" rx="4.5" ry="2.5" fill="#E2725B" opacity="0.6" />
          <ellipse cx="100" cy="92" rx="4.5" ry="2.5" fill="#E2725B" opacity="0.6" />

          {/* Chef Toque (Hat) */}
          <g transform="translate(0, -2)">
            {/* Hat base band */}
            <rect x="62" y="58" width="36" height="8" rx="3" fill="#FAF6EE" stroke="#D4CFC4" strokeWidth="1.5" />
            {/* Puffs */}
            <path
              d="M62 58 C56 50 60 38 70 38 C74 32 86 32 90 38 C100 38 104 50 98 58 Z"
              fill="#FFFFFF"
              stroke="#D4CFC4"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Hat Creases */}
            <path d="M72 44 L73 54" stroke="#E5E0D6" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M80 40 L80 53" stroke="#E5E0D6" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M88 44 L87 54" stroke="#E5E0D6" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>

        {/* ── BUBBLING PALAYOK (CLAY POT) ── */}
        <g className="palayok-container" transform="translate(45, 10)">
          {/* Pot Shadow */}
          <ellipse cx="98" cy="148" rx="32" ry="7" fill="rgba(32, 19, 14, 0.15)" />

          {/* Pot Body */}
          <path
            d="M72 118 C70 138 82 146 98 146 C114 146 126 138 124 118 Z"
            fill="#C84B31"
            stroke="#9E341E"
            strokeWidth="2"
          />
          {/* Pot Rim */}
          <ellipse cx="98" cy="118" rx="27" ry="6" fill="#A83920" stroke="#7A2814" strokeWidth="1.5" />
          {/* Bubbling Golden Stew */}
          <ellipse cx="98" cy="118" rx="23" ry="4.5" fill="#F39C12" />

          {/* Stew Bubbles */}
          <motion.circle
            cx="92"
            cy="117"
            r="2"
            fill="#FFE082"
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <motion.circle
            cx="104"
            cy="118"
            r="1.8"
            fill="#FFE082"
            animate={{ scale: [1.3, 0.7, 1.3], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />

          {/* Wooden Ladle (Sandok) stirring in pot */}
          <motion.g
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '98px 116px' }}
          >
            <path
              d="M76 86 L98 116"
              stroke="#C59A6B"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <ellipse cx="98" cy="117" rx="5" ry="3" fill="#A07242" />
          </motion.g>
        </g>
      </svg>
    </div>
  )
}
