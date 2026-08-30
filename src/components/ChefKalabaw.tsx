import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export interface StirParticle {
  id: number
  type: 'leaf' | 'chili' | 'garlic' | 'steam' | 'sparkle'
  x: number
  y: number
  rotation: number
}

interface ChefKalabawProps {
  size?: number
  className?: string
  onStir?: () => void
  stirCount?: number
}

export function ChefKalabaw({ size = 180, className = '', onStir, stirCount = 0 }: ChefKalabawProps) {
  const [wobbleKey, setWobbleKey] = useState(0)
  const [particles, setParticles] = useState<StirParticle[]>([])

  const handlePotClick = () => {
    setWobbleKey((prev) => prev + 1)
    
    // Spawn 2-3 fun culinary particles on each stir
    const particleTypes: StirParticle['type'][] = ['leaf', 'chili', 'garlic', 'steam', 'sparkle']
    const newParticles: StirParticle[] = Array.from({ length: 2 }).map(() => ({
      id: Date.now() + Math.random(),
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
      x: 130 + (Math.random() - 0.5) * 35,
      y: 110 + (Math.random() - 0.5) * 15,
      rotation: (Math.random() - 0.5) * 60,
    }))

    setParticles((prev) => [...prev.slice(-8), ...newParticles])
    if (onStir) onStir()
  }

  // Cleanup old particles automatically
  useEffect(() => {
    if (particles.length === 0) return undefined
    const timer = window.setTimeout(() => {
      setParticles((prev) => prev.slice(1))
    }, 900)
    return () => window.clearTimeout(timer)
  }, [particles])

  return (
    <div
      className={`chef-kalabaw-wrapper ${onStir ? 'chef-kalabaw-interactive' : ''} ${className}`}
      style={{ width: size, height: size * 0.95 }}
      onClick={handlePotClick}
      role={onStir ? 'button' : undefined}
      tabIndex={onStir ? 0 : undefined}
      onKeyDown={onStir ? (e) => (e.key === 'Enter' || e.key === ' ' ? handlePotClick() : null) : undefined}
      aria-label={onStir ? 'Haluin ang palayok' : 'Chef Kalabaw Mascot'}
    >
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

          {/* Eyes (Happy Expression with playful wink when stirred >= 5 times) */}
          <circle cx="68" cy="82" r="4.5" fill="#1C1814" />
          <circle cx="66.5" cy="80.5" r="1.5" fill="#FFFFFF" />
          {stirCount >= 5 ? (
            <path d="M87 82 Q92 77 97 82" stroke="#1C1814" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <>
              <circle cx="92" cy="82" r="4.5" fill="#1C1814" />
              <circle cx="90.5" cy="80.5" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Cheerful Blush */}
          <ellipse cx="60" cy="92" rx="4.5" ry="2.5" fill="#E2725B" opacity="0.6" />
          <ellipse cx="100" cy="92" rx="4.5" ry="2.5" fill="#E2725B" opacity="0.6" />

          {/* Chef Toque (Hat) */}
          <motion.g
            animate={wobbleKey > 0 ? { y: [-2, -6, -2], rotate: [-4, 4, 0] } : {}}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{ transformOrigin: '80px 58px' }}
          >
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
          </motion.g>
        </g>

        {/* ── BUBBLING PALAYOK (CLAY POT) WITH SPRING PHYSICS ── */}
        <motion.g
          key={wobbleKey}
          className="palayok-container"
          transform="translate(45, 10)"
          animate={wobbleKey > 0 ? { rotate: [-7, 7, -4, 3, 0], scale: [1, 1.07, 0.96, 1] } : {}}
          transition={{ type: 'spring', stiffness: 450, damping: 14 }}
          style={{ transformOrigin: '98px 130px' }}
        >
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

          {/* Wooden Ladle (Sandok) stirring in pot with interactive spin */}
          <motion.g
            animate={
              wobbleKey > 0
                ? { rotate: [-18, 18, -10, 6, 0] }
                : { rotate: [-6, 6, -6] }
            }
            transition={
              wobbleKey > 0
                ? { type: 'spring', stiffness: 500, damping: 10 }
                : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
            }
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
        </motion.g>

        {/* ── BURST PARTICLES (BAY LEAVES, CHILIS, STEAM, STARS) ── */}
        <g className="stir-particles-layer">
          <AnimatePresence>
            {particles.map((p) => (
              <motion.g
                key={p.id}
                initial={{ opacity: 1, scale: 0.6, y: p.y, x: p.x }}
                animate={{
                  opacity: 0,
                  scale: 1.15,
                  y: p.y - 40 - Math.random() * 20,
                  x: p.x + (Math.random() - 0.5) * 35,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
              >
                {p.type === 'leaf' && (
                  /* Green Laurel / Bay Leaf */
                  <path
                    d="M0 0 C4 -6 10 -4 12 0 C10 6 4 6 0 0 Z"
                    fill="#3E8E41"
                    transform={`rotate(${p.rotation})`}
                  />
                )}
                {p.type === 'chili' && (
                  /* Siling Labuyo */
                  <path
                    d="M0 0 C3 -4 7 -8 6 -12 C5 -13 3 -11 0 -6 C-2 -4 -2 -2 0 0 Z"
                    fill="#DC3D43"
                    transform={`rotate(${p.rotation})`}
                  />
                )}
                {p.type === 'garlic' && (
                  /* Garlic Clove */
                  <path
                    d="M0 0 C-3 -3 -3 -7 0 -9 C3 -7 3 -3 0 0 Z"
                    fill="#F2E6C2"
                    stroke="#D6C495"
                    strokeWidth="0.8"
                    transform={`rotate(${p.rotation})`}
                  />
                )}
                {p.type === 'sparkle' && (
                  /* 4-Point Star */
                  <path
                    d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z"
                    fill="#F39C12"
                  />
                )}
                {p.type === 'steam' && (
                  /* Steam Puff */
                  <circle cx="0" cy="0" r="4.5" fill="#FAF6EE" opacity="0.85" />
                )}
              </motion.g>
            ))}
          </AnimatePresence>
        </g>
      </svg>
    </div>
  )
}
