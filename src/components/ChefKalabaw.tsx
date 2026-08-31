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

    const particleTypes: StirParticle['type'][] = ['leaf', 'chili', 'garlic', 'steam', 'sparkle']
    const newParticles: StirParticle[] = Array.from({ length: 2 }).map(() => ({
      id: Date.now() + Math.random(),
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
      x: 100 + (Math.random() - 0.5) * 30,
      y: 118 + (Math.random() - 0.5) * 10,
      rotation: (Math.random() - 0.5) * 60,
    }))

    setParticles((prev) => [...prev.slice(-8), ...newParticles])
    if (onStir) onStir()
  }

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
      aria-label={onStir ? 'Stir the cooking pot' : 'Chef Kalabaw Mascot'}
    >
      <svg
        viewBox="0 0 200 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="chef-kalabaw-svg"
        aria-hidden="true"
      >
        <defs>

          <radialGradient id="palayokGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#D97706" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="palayokBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E25C3E" />
            <stop offset="28%" stopColor="#C84B31" />
            <stop offset="70%" stopColor="#9C341D" />
            <stop offset="100%" stopColor="#6E2010" />
          </linearGradient>

          <linearGradient id="palayokRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EA694B" />
            <stop offset="50%" stopColor="#B63F26" />
            <stop offset="100%" stopColor="#752210" />
          </linearGradient>

          <radialGradient id="stewBrothGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </radialGradient>

          <linearGradient id="sandokWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBA8C" />
            <stop offset="50%" stopColor="#B38150" />
            <stop offset="100%" stopColor="#7A4E26" />
          </linearGradient>

          <linearGradient id="hornLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#755642" />
            <stop offset="35%" stopColor="#4A3427" />
            <stop offset="75%" stopColor="#2E1F16" />
            <stop offset="100%" stopColor="#1A110B" />
          </linearGradient>

          <linearGradient id="hornRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#755642" />
            <stop offset="35%" stopColor="#4A3427" />
            <stop offset="75%" stopColor="#2E1F16" />
            <stop offset="100%" stopColor="#1A110B" />
          </linearGradient>

          <radialGradient id="kalabawHeadGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#635B52" />
            <stop offset="55%" stopColor="#4A433B" />
            <stop offset="100%" stopColor="#302B25" />
          </radialGradient>

          <radialGradient id="kalabawMuzzleGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#82776A" />
            <stop offset="60%" stopColor="#665D52" />
            <stop offset="100%" stopColor="#484037" />
          </radialGradient>

          <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="toqueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F5EFE6" />
            <stop offset="100%" stopColor="#DBD4C7" />
          </linearGradient>

          <linearGradient id="bandanaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E64A2E" />
            <stop offset="55%" stopColor="#C8381E" />
            <stop offset="100%" stopColor="#8C1F0B" />
          </linearGradient>

          <linearGradient id="steamSoftGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#FAF6EE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="115" r="75" fill="url(#palayokGlow)" />

        <motion.g
          animate={{ y: [-2, -8, -2], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M92 110 C86 98 96 86 90 74 C86 64 92 56 88 48"
            stroke="url(#steamSoftGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M106 112 C112 100 102 88 108 76 C114 66 108 58 112 50"
            stroke="url(#steamSoftGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M118 114 C122 104 116 94 120 84 C124 76 118 70 122 62"
            stroke="url(#steamSoftGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        <motion.g
          key={wobbleKey}
          className="chef-cooking-assembly"
          animate={
            wobbleKey > 0
              ? { rotate: [-3, 3, -2, 1, 0], y: [0, -3.5, 0], scale: [1, 1.03, 0.98, 1] }
              : { y: [0, -1.5, 0] }
          }
          transition={
            wobbleKey > 0
              ? { type: 'spring', stiffness: 450, damping: 14 }
              : { duration: 3.0, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ transformOrigin: '100px 145px' }}
        >

          <path
            d="M56 150 C56 108 72 98 100 98 C128 98 144 108 144 150 Z"
            fill="url(#kalabawHeadGrad)"
            stroke="#26221C"
            strokeWidth="1"
          />

          <path
            d="M68 110 L132 110 L138 152 L62 152 Z"
            fill="#F9F6EE"
            stroke="#D4CDBC"
            strokeWidth="1.2"
          />

          <path d="M68 111 L132 111" stroke="#2D6A4F" strokeWidth="2.2" strokeLinecap="round" />

          <path
            d="M84 102 L116 102 L100 118 Z"
            fill="url(#bandanaGrad)"
            stroke="#781706"
            strokeWidth="1"
          />
          <circle cx="100" cy="104" r="3.2" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />

          <g className="kalabaw-head">

            <path
              d="M78 68 C58 58 40 36 54 20 C64 8 82 24 90 44 Z"
              fill="url(#hornLeftGrad)"
              stroke="#261A13"
              strokeWidth="1.4"
            />
            <path d="M60 28 C64 32 69 36 74 40" stroke="#3A281E" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
            <path d="M66 38 C70 42 76 46 82 50" stroke="#3A281E" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />

            <path
              d="M122 68 C142 58 160 36 146 20 C136 8 118 24 110 44 Z"
              fill="url(#hornRightGrad)"
              stroke="#261A13"
              strokeWidth="1.4"
            />
            <path d="M140 28 C136 32 131 36 126 40" stroke="#3A281E" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
            <path d="M134 38 C130 42 124 46 118 50" stroke="#3A281E" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />

            <ellipse cx="64" cy="72" rx="14" ry="7.5" transform="rotate(-18 64 72)" fill="#443D36" stroke="#2B2620" strokeWidth="1" />
            <ellipse cx="64" cy="72" rx="9" ry="4.5" transform="rotate(-18 64 72)" fill="#C28A62" opacity="0.75" />

            <ellipse cx="136" cy="72" rx="14" ry="7.5" transform="rotate(18 136 72)" fill="#443D36" stroke="#2B2620" strokeWidth="1" />
            <ellipse cx="136" cy="72" rx="9" ry="4.5" transform="rotate(18 136 72)" fill="#C28A62" opacity="0.75" />

            <ellipse cx="100" cy="74" rx="28" ry="24" fill="url(#kalabawHeadGrad)" stroke="#26221C" strokeWidth="1" />

            <ellipse cx="100" cy="85" rx="20" ry="14" fill="url(#kalabawMuzzleGrad)" stroke="#38322B" strokeWidth="1" />

            <ellipse cx="91.5" cy="84.5" rx="3.6" ry="4.6" fill="#1C1814" />
            <ellipse cx="90.8" cy="83.5" rx="1.2" ry="1.6" fill="#3D362F" />
            <ellipse cx="108.5" cy="84.5" rx="3.6" ry="4.6" fill="#1C1814" />
            <ellipse cx="107.8" cy="83.5" rx="1.2" ry="1.6" fill="#3D362F" />

            <path d="M93 92 Q100 96 107 92" stroke="#2B241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            <path
              d="M93 89 C93 100 107 100 107 89"
              stroke="url(#goldRingGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="100" cy="98" r="1" fill="#FFFFFF" />

            <circle cx="87.5" cy="68" r="4.8" fill="#15120F" />
            <circle cx="86" cy="66.5" r="1.8" fill="#FFFFFF" />
            <circle cx="89.2" cy="69.5" r="0.8" fill="#FFFFFF" opacity="0.8" />
            <path d="M83 61 Q88 58 93 61" stroke="#2A241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {stirCount >= 5 ? (
              <g className="winking-eye">
                <path d="M106 68 Q112 62 118 68" stroke="#15120F" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M107 60 Q112 57 117 60" stroke="#2A241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              <g className="normal-right-eye">
                <circle cx="112.5" cy="68" r="4.8" fill="#15120F" />
                <circle cx="111" cy="66.5" r="1.8" fill="#FFFFFF" />
                <circle cx="114.2" cy="69.5" r="0.8" fill="#FFFFFF" opacity="0.8" />
                <path d="M107 61 Q112 58 117 61" stroke="#2A241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            <ellipse cx="78.5" cy="78" rx="5" ry="2.8" fill="#E2725B" opacity="0.55" />
            <ellipse cx="121.5" cy="78" rx="5" ry="2.8" fill="#E2725B" opacity="0.55" />

            <g className="chef-toque">
              <rect x="80" y="44" width="40" height="9" rx="3" fill="#FFFFFF" stroke="#D1C8B8" strokeWidth="1.4" />
              <path d="M83 48.5 L117 48.5" stroke="#E5DEC9" strokeWidth="1" strokeDasharray="3 2" />
              <path
                d="M80 44 C74 34 78 22 90 22 C93 14 107 14 110 22 C122 22 126 34 120 44 Z"
                fill="url(#toqueGrad)"
                stroke="#C9C0AF"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M91 28 L92 40" stroke="#D8D0BE" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M100 22 L100 38" stroke="#D8D0BE" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M109 28 L108 40" stroke="#D8D0BE" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>

          <g className="left-arm-holding-pot">

            <path
              d="M62 110 C50 118 46 134 56 142 C64 146 72 138 72 130 C72 122 68 114 62 110 Z"
              fill="url(#kalabawHeadGrad)"
              stroke="#26221C"
              strokeWidth="1"
            />

            <ellipse cx="58" cy="132" rx="6.5" ry="5" fill="#261E18" stroke="#18130F" strokeWidth="0.8" />
            <path d="M58 128 L58 136" stroke="#483B30" strokeWidth="0.8" />
          </g>

          <g className="palayok-pot-assembly">

            <ellipse cx="100" cy="155" rx="42" ry="7.5" fill="rgba(32, 19, 14, 0.22)" />

            <path d="M66 128 C56 128 56 138 66 138" stroke="#A83920" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M134 128 C144 128 144 138 134 138" stroke="#A83920" strokeWidth="3.5" strokeLinecap="round" fill="none" />

            <path
              d="M66 125 C64 146 78 154 100 154 C122 154 136 146 134 125 Z"
              fill="url(#palayokBodyGrad)"
              stroke="#6B1D0E"
              strokeWidth="1.8"
            />

            <path
              d="M72 132 C70 144 78 150 92 151"
              stroke="#F0795D"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.45"
            />

            <ellipse cx="100" cy="125.5" rx="34" ry="7" fill="url(#palayokRimGrad)" stroke="#5E190B" strokeWidth="1.2" />

            <ellipse cx="100" cy="125.5" rx="30" ry="5.6" fill="url(#stewBrothGrad)" />
            <ellipse cx="100" cy="125.5" rx="27" ry="4.2" stroke="#FEF3C7" strokeWidth="0.8" opacity="0.6" fill="none" />

            <motion.circle
              cx="92"
              cy="124.5"
              r="2.2"
              fill="#FFFBEB"
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <motion.circle
              cx="108"
              cy="125.8"
              r="1.8"
              fill="#FFFBEB"
              animate={{ scale: [1.3, 0.7, 1.3], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.25 }}
            />
            <motion.circle
              cx="100"
              cy="123.5"
              r="1.4"
              fill="#FEF08A"
              animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: 0.4 }}
            />
          </g>

          <motion.g
            className="right-arm-and-sandok-group"
            animate={
              wobbleKey > 0
                ? {
                    rotate: [-14, 14, -8, 4, 0],
                    x: [-1, 2, -1, 0],
                  }
                : {
                    rotate: [-5, 5, -5],
                    x: [-0.8, 1.2, -0.8],
                  }
            }
            transition={
              wobbleKey > 0
                ? { type: 'spring', stiffness: 520, damping: 12 }
                : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{ transformOrigin: '136px 110px' }}
          >

            <path
              d="M136 110 C146 118 138 132 126 128 C118 124 116 114 126 108 Z"
              fill="url(#kalabawHeadGrad)"
              stroke="#26221C"
              strokeWidth="1"
            />

            <path
              d="M128 92 L104 128"
              stroke="url(#sandokWoodGrad)"
              strokeWidth="4.2"
              strokeLinecap="round"
            />
            <path
              d="M127.5 93 L104.5 127"
              stroke="#F2D6B3"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.6"
            />

            <ellipse cx="104" cy="128.5" rx="6" ry="3.8" fill="url(#sandokWoodGrad)" stroke="#543315" strokeWidth="0.8" />
            <ellipse cx="103.5" cy="128.2" rx="4" ry="2.2" fill="#543315" opacity="0.4" />

            <ellipse cx="120" cy="110" rx="6.5" ry="5.5" fill="#261E18" stroke="#18130F" strokeWidth="0.8" />
            <path d="M120 106 L120 114" stroke="#483B30" strokeWidth="0.8" />
          </motion.g>
        </motion.g>

        <g className="stir-particles-layer">
          <AnimatePresence>
            {particles.map((p) => (
              <motion.g
                key={p.id}
                initial={{ opacity: 1, scale: 0.6, y: p.y, x: p.x }}
                animate={{
                  opacity: 0,
                  scale: 1.2,
                  y: p.y - 45 - Math.random() * 25,
                  x: p.x + (Math.random() - 0.5) * 40,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {p.type === 'leaf' && (

                  <g transform={`rotate(${p.rotation})`}>
                    <path
                      d="M0 0 C4 -7 11 -5 13 0 C11 7 4 7 0 0 Z"
                      fill="#2D6A4F"
                      stroke="#1B4332"
                      strokeWidth="0.6"
                    />
                    <path d="M1 0 L12 0" stroke="#74C69D" strokeWidth="0.6" strokeLinecap="round" />
                  </g>
                )}
                {p.type === 'chili' && (

                  <g transform={`rotate(${p.rotation})`}>
                    <path
                      d="M0 0 C3 -4 8 -9 7 -13 C5.5 -14 3 -12 0 -7 C-2 -4 -2 -2 0 0 Z"
                      fill="#DC2626"
                      stroke="#991B1B"
                      strokeWidth="0.6"
                    />
                    <path d="M7 -13 C8 -15 10 -15 11 -14" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                )}
                {p.type === 'garlic' && (

                  <g transform={`rotate(${p.rotation})`}>
                    <path
                      d="M0 0 C-4 -3 -4 -8 0 -11 C4 -8 4 -3 0 0 Z"
                      fill="#FEF3C7"
                      stroke="#D97706"
                      strokeWidth="0.8"
                    />
                    <path d="M0 -11 L0 -2" stroke="#FDE68A" strokeWidth="0.6" />
                  </g>
                )}
                {p.type === 'sparkle' && (

                  <path
                    d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"
                    fill="#F59E0B"
                  />
                )}
                {p.type === 'steam' && (

                  <circle cx="0" cy="0" r="5" fill="#FFFFFF" opacity="0.8" />
                )}
              </motion.g>
            ))}
          </AnimatePresence>
        </g>
      </svg>
    </div>
  )
}

