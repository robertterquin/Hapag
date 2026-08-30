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
      x: 132 + (Math.random() - 0.5) * 35,
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
        <defs>
          {/* ── REALISTIC SHADING & MATERIAL GRADIENTS ── */}
          
          {/* Earthen Clay Palayok Gradients */}
          <radialGradient id="palayokGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#D97706" stopOpacity="0.15" />
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

          <radialGradient id="stewBrothGrad" cx="48%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </radialGradient>

          {/* Wooden Sandok (Ladle) */}
          <linearGradient id="sandokWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBA8C" />
            <stop offset="50%" stopColor="#B38150" />
            <stop offset="100%" stopColor="#7A4E26" />
          </linearGradient>

          {/* Kalabaw Horns Gradient */}
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

          {/* Kalabaw Fur & Skin Gradient */}
          <radialGradient id="kalabawHeadGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#635B52" />
            <stop offset="55%" stopColor="#4A433B" />
            <stop offset="100%" stopColor="#302B25" />
          </radialGradient>

          <radialGradient id="kalabawMuzzleGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#82776A" />
            <stop offset="60%" stopColor="#665D52" />
            <stop offset="100%" stopColor="#484037" />
          </radialGradient>

          {/* Golden Nose Ring Metallic Gradient */}
          <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Chef Toque (Cotton Fabric Shading) */}
          <linearGradient id="toqueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F5EFE6" />
            <stop offset="100%" stopColor="#DBD4C7" />
          </linearGradient>

          {/* Red Neckerchief Silk */}
          <linearGradient id="bandanaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E64A2E" />
            <stop offset="55%" stopColor="#C8381E" />
            <stop offset="100%" stopColor="#8C1F0B" />
          </linearGradient>

          {/* Steam feathered opacity */}
          <linearGradient id="steamSoftGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#FAF6EE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── WARM AMBIENT KUSINA GLOW ── */}
        <circle cx="100" cy="115" r="75" fill="url(#palayokGlow)" />

        {/* ── BILLOWING REALISTIC STEAM ── */}
        <motion.g
          animate={{ y: [-2, -9, -2], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Main billowing steam plumes */}
          <path
            d="M136 78 C130 66 142 54 135 42 C130 32 138 24 133 16"
            stroke="url(#steamSoftGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M148 80 C143 70 154 58 147 48 C142 38 150 28 145 18"
            stroke="url(#steamSoftGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M124 82 C120 74 128 66 123 56 C120 48 126 40 122 32"
            stroke="url(#steamSoftGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* ── CHEF KALABAW ANATOMY & DETAILS ── */}
        <g className="kalabaw-character">
          {/* 1. Horns with realistic anatomical ridges */}
          {/* Left Horn */}
          <g className="left-horn">
            <path
              d="M58 82 C38 72 20 48 34 30 C44 18 62 34 70 54 Z"
              fill="url(#hornLeftGrad)"
              stroke="#261A13"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Horn texture ridges */}
            <path d="M40 38 C44 42 49 46 54 50" stroke="#3A281E" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            <path d="M46 48 C50 52 56 56 62 60" stroke="#3A281E" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            <path d="M52 58 C56 62 62 66 68 70" stroke="#3A281E" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            {/* Horn tip highlight */}
            <path d="M34 30 C36 26 40 24 43 25" stroke="#967258" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          </g>

          {/* Right Horn */}
          <g className="right-horn">
            <path
              d="M102 82 C122 72 140 48 126 30 C116 18 98 34 90 54 Z"
              fill="url(#hornRightGrad)"
              stroke="#261A13"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Horn texture ridges */}
            <path d="M120 38 C116 42 111 46 106 50" stroke="#3A281E" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            <path d="M114 48 C110 52 104 56 98 60" stroke="#3A281E" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            <path d="M108 58 C104 62 98 66 92 70" stroke="#3A281E" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            {/* Horn tip highlight */}
            <path d="M126 30 C124 26 120 24 117 25" stroke="#967258" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          </g>

          {/* 2. Ears with inner ear depth */}
          <g className="ears">
            {/* Left Ear */}
            <ellipse cx="44" cy="86" rx="14" ry="7.5" transform="rotate(-20 44 86)" fill="#443D36" stroke="#2B2620" strokeWidth="1" />
            <ellipse cx="44" cy="86" rx="9" ry="4.5" transform="rotate(-20 44 86)" fill="#C28A62" opacity="0.75" />
            <path d="M38 88 Q44 86 50 84" stroke="#8A5A38" strokeWidth="1" transform="rotate(-20 44 86)" opacity="0.6" />

            {/* Right Ear */}
            <ellipse cx="116" cy="86" rx="14" ry="7.5" transform="rotate(20 116 86)" fill="#443D36" stroke="#2B2620" strokeWidth="1" />
            <ellipse cx="116" cy="86" rx="9" ry="4.5" transform="rotate(20 116 86)" fill="#C28A62" opacity="0.75" />
            <path d="M110 88 Q116 86 122 84" stroke="#8A5A38" strokeWidth="1" transform="rotate(20 116 86)" opacity="0.6" />
          </g>

          {/* 3. Shoulders & Body */}
          <path
            d="M38 152 C38 124 54 110 80 110 C106 110 122 124 122 152 Z"
            fill="url(#kalabawHeadGrad)"
            stroke="#26221C"
            strokeWidth="1"
          />

          {/* 4. Canvas Apron with subtle banana-leaf green accent trim */}
          <g className="chef-apron">
            {/* Main Apron Canvas */}
            <path
              d="M54 120 L106 120 L112 152 L48 152 Z"
              fill="#F9F6EE"
              stroke="#D4CDBC"
              strokeWidth="1.2"
            />
            {/* Top border trim (Banana Leaf Green) */}
            <path d="M54 121 L106 121" stroke="#2D6A4F" strokeWidth="2.2" strokeLinecap="round" />
            {/* Apron Pocket */}
            <rect x="68" y="134" width="24" height="15" rx="2.5" fill="#EFE8D8" stroke="#D1C7B2" strokeWidth="1" />
            <path d="M72 134 L88 134" stroke="#2D6A4F" strokeWidth="1.2" />
          </g>

          {/* 5. Silk Red Neckerchief (Bandana) */}
          <g className="neckerchief">
            <path
              d="M66 113 L94 113 L80 129 Z"
              fill="url(#bandanaGrad)"
              stroke="#781706"
              strokeWidth="1"
            />
            {/* Bandana Knot & Fold Shadow */}
            <path d="M72 113 Q80 120 88 113" stroke="#8C1F0B" strokeWidth="1.5" fill="none" opacity="0.7" />
            <circle cx="80" cy="115" r="3.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
            <circle cx="79.2" cy="114.2" r="1" fill="#FFF2A3" />
          </g>

          {/* 6. Sculpted Head Base */}
          <ellipse cx="80" cy="87" rx="29" ry="25" fill="url(#kalabawHeadGrad)" stroke="#26221C" strokeWidth="1" />

          {/* 7. Cheerful Muzzle / Snout with skin gradient */}
          <g className="muzzle">
            <ellipse cx="80" cy="98" rx="21" ry="14.5" fill="url(#kalabawMuzzleGrad)" stroke="#38322B" strokeWidth="1" />
            
            {/* Nostrils */}
            <ellipse cx="71.5" cy="97.5" rx="3.8" ry="4.8" fill="#1C1814" />
            <ellipse cx="70.8" cy="96.5" rx="1.2" ry="1.8" fill="#3D362F" />
            <ellipse cx="88.5" cy="97.5" rx="3.8" ry="4.8" fill="#1C1814" />
            <ellipse cx="87.8" cy="96.5" rx="1.2" ry="1.8" fill="#3D362F" />
            
            {/* Friendly smiling mouth curve under nose ring */}
            <path d="M73 105 Q80 109 87 105" stroke="#2B241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Polished Metallic 18k Golden Nose Ring */}
            <path
              d="M73 102 C73 113 87 113 87 102"
              stroke="url(#goldRingGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Nose ring light gleam / specular reflection */}
            <circle cx="80" cy="111" r="1" fill="#FFFFFF" />
          </g>

          {/* 8. Expressive Eyes with Deep Highlights & Sparkle */}
          <g className="eyes">
            {/* Left Eye */}
            <circle cx="67.5" cy="81" r="4.8" fill="#15120F" />
            <circle cx="66" cy="79.5" r="1.8" fill="#FFFFFF" />
            <circle cx="69.2" cy="82.5" r="0.8" fill="#FFFFFF" opacity="0.8" />
            {/* Eyebrow */}
            <path d="M63 74 Q68 71 73 74" stroke="#2A241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Right Eye (Normal vs Winking on high stir count) */}
            {stirCount >= 5 ? (
              <g className="winking-eye">
                <path d="M86 81 Q92 75 98 81" stroke="#15120F" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <path d="M87 73 Q92 70 97 73" stroke="#2A241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              <g className="normal-right-eye">
                <circle cx="92.5" cy="81" r="4.8" fill="#15120F" />
                <circle cx="91" cy="79.5" r="1.8" fill="#FFFFFF" />
                <circle cx="94.2" cy="82.5" r="0.8" fill="#FFFFFF" opacity="0.8" />
                {/* Eyebrow */}
                <path d="M87 74 Q92 71 97 74" stroke="#2A241E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Rosy Cheeks Blush */}
            <ellipse cx="58.5" cy="91" rx="5" ry="2.8" fill="#E2725B" opacity="0.55" />
            <ellipse cx="101.5" cy="91" rx="5" ry="2.8" fill="#E2725B" opacity="0.55" />
          </g>

          {/* 9. Pleated Cotton Chef's Toque (Hat) */}
          <motion.g
            animate={wobbleKey > 0 ? { y: [-2, -6, -2], rotate: [-4, 4, 0] } : {}}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{ transformOrigin: '80px 58px' }}
          >
            {/* Hat base headband with structured stitching */}
            <rect x="60" y="56" width="40" height="9" rx="3" fill="#FFFFFF" stroke="#D1C8B8" strokeWidth="1.4" />
            <path d="M63 60.5 L97 60.5" stroke="#E5DEC9" strokeWidth="1" strokeDasharray="3 2" />

            {/* Puffy pleated crown with soft cotton shading */}
            <path
              d="M60 56 C54 46 58 34 70 34 C73 26 87 26 90 34 C102 34 106 46 100 56 Z"
              fill="url(#toqueGrad)"
              stroke="#C9C0AF"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Pleat shadows */}
            <path d="M71 40 L72 52" stroke="#D8D0BE" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M80 34 L80 50" stroke="#D8D0BE" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M89 40 L88 52" stroke="#D8D0BE" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
        </g>

        {/* ── REALISTIC EARTHENWARE PALAYOK (CLAY POT) ── */}
        <motion.g
          key={wobbleKey}
          className="palayok-container"
          transform="translate(45, 10)"
          animate={wobbleKey > 0 ? { rotate: [-7, 7, -4, 3, 0], scale: [1, 1.07, 0.96, 1] } : {}}
          transition={{ type: 'spring', stiffness: 450, damping: 14 }}
          style={{ transformOrigin: '98px 130px' }}
        >
          {/* Earthen Drop Shadow on Table */}
          <ellipse cx="98" cy="149" rx="34" ry="7.5" fill="rgba(32, 19, 14, 0.22)" />

          {/* Clay Pot Handles (Tenga ng Palayok) */}
          <path d="M68 122 C62 122 62 132 68 132" stroke="#A83920" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M128 122 C134 122 134 132 128 132" stroke="#A83920" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Pot Main Clay Body with radial curve and kiln glaze */}
          <path
            d="M70 117 C68 139 80 147 98 147 C116 147 128 139 126 117 Z"
            fill="url(#palayokBodyGrad)"
            stroke="#6B1D0E"
            strokeWidth="1.8"
          />
          {/* Clay luster highlight reflection */}
          <path
            d="M76 124 C74 138 82 143 92 144"
            stroke="#F0795D"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          />

          {/* Pot Clay Rim Collar */}
          <ellipse cx="98" cy="117.5" rx="28.5" ry="6.5" fill="url(#palayokRimGrad)" stroke="#5E190B" strokeWidth="1.2" />
          
          {/* Simmering Broth Inner Shadow & Liquid */}
          <ellipse cx="98" cy="117.5" rx="25" ry="5.2" fill="url(#stewBrothGrad)" />
          {/* Translucent Golden Broth Rim Sheen */}
          <ellipse cx="98" cy="117.5" rx="22.5" ry="3.8" stroke="#FEF3C7" strokeWidth="0.8" opacity="0.6" fill="none" />

          {/* Simmering Boiling Foam & Bubbles */}
          <motion.circle
            cx="90"
            cy="116.5"
            r="2.2"
            fill="#FFFBEB"
            animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
          <motion.circle
            cx="105"
            cy="117.8"
            r="1.8"
            fill="#FFFBEB"
            animate={{ scale: [1.4, 0.7, 1.4], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.25 }}
          />
          <motion.circle
            cx="98"
            cy="115.5"
            r="1.4"
            fill="#FEF08A"
            animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: 0.4 }}
          />

          {/* Handcrafted Wooden Sandok (Ladle) stirring in stew */}
          <motion.g
            animate={
              wobbleKey > 0
                ? { rotate: [-20, 20, -12, 8, 0] }
                : { rotate: [-6, 6, -6] }
            }
            transition={
              wobbleKey > 0
                ? { type: 'spring', stiffness: 500, damping: 10 }
                : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{ transformOrigin: '98px 116px' }}
          >
            {/* Wooden Handle with Kamagong Grain */}
            <path
              d="M74 84 L98 116"
              stroke="url(#sandokWoodGrad)"
              strokeWidth="4.2"
              strokeLinecap="round"
            />
            {/* Handle wood grain highlight line */}
            <path
              d="M74.8 84.8 L97 114.5"
              stroke="#F2D6B3"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Scooped Wooden Ladle Head */}
            <ellipse cx="98" cy="116.8" rx="6" ry="3.8" fill="url(#sandokWoodGrad)" stroke="#543315" strokeWidth="0.8" />
            <ellipse cx="97.5" cy="116.5" rx="4.2" ry="2.2" fill="#543315" opacity="0.4" />
          </motion.g>
        </motion.g>

        {/* ── BURST PARTICLES ENGINE (BAY LEAF, CHILI, GARLIC, SPARKLES) ── */}
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
                  /* Authentic Textured Bay Leaf (Dahon ng Laura) */
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
                  /* Siling Labuyo with green calyx stem */
                  <g transform={`rotate(${p.rotation})`}>
                    <path
                      d="M0 0 C3 -4 8 -9 7 -13 C5.5 -14 3 -12 0 -7 C-2 -4 -2 -2 0 0 Z"
                      fill="#DC2626"
                      stroke="#991B1B"
                      strokeWidth="0.6"
                    />
                    {/* Green stem */}
                    <path d="M7 -13 C8 -15 10 -15 11 -14" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                )}
                {p.type === 'garlic' && (
                  /* Realistic Golden Garlic Clove (Bawang) */
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
                  /* 4-Point Golden Star Sparkle */
                  <path
                    d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"
                    fill="#F59E0B"
                  />
                )}
                {p.type === 'steam' && (
                  /* Soft Billowing Steam Puff */
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

