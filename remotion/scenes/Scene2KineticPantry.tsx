import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const INGREDIENTS = [
  { name: 'Manok', icon: '🍗', category: 'Protein', glow: '#F4B942' },
  { name: 'Bawang', icon: '🧄', category: 'Aromatic', glow: '#FFFDF5' },
  { name: 'Sibuyas', icon: '🧅', category: 'Aromatic', glow: '#C84B31' },
  { name: 'Toyo', icon: '🍶', category: 'Sauce', glow: '#087F8C' },
  { name: 'Suka', icon: '🌿', category: 'Acid', glow: '#4F8A5B' },
];

export const Scene2KineticPantry: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bass drop entrance impact at frame 0 (local frame 0 = global frame 105)
  const dropSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.9 },
  });

  // Outro transition
  const outroOpacity = interpolate(frame, [92, 105], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroScale = interpolate(frame, [85, 105], [1, 0.9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Camera 3D perspective tilt
  const tiltX = interpolate(frame, [0, 80], [15, 4]);
  const tiltY = interpolate(frame, [0, 80], [-8, 2]);

  // Rolling counter from 0 to 12
  const counterValue = Math.min(
    12,
    Math.floor(
      interpolate(frame, [30, 80], [0, 12], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    )
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 60px',
        perspective: 1200,
        transform: `scale(${outroScale})`,
        opacity: outroOpacity,
        zIndex: 10,
      }}
    >
      {/* Kinetic Headline */}
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${dropSpring}) translateY(${interpolate(
            dropSpring,
            [0, 1],
            [-50, 0]
          )}px)`,
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '5px',
            color: '#0CA6B7',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          INPUT YOUR INGREDIENTS
        </div>
        <h2
          style={{
            fontSize: '84px',
            fontWeight: 900,
            color: '#FFFDF5',
            margin: 0,
            lineHeight: 1,
            letterSpacing: '-2px',
            textShadow: '0 0 50px rgba(8, 127, 140, 0.6), 0 10px 30px rgba(0,0,0,0.9)',
          }}
        >
          ANO’NG ULAM?
        </h2>
      </div>

      {/* 3D Floating Pantry Glass Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 920,
          background: 'rgba(12, 24, 30, 0.75)',
          borderRadius: 36,
          padding: '48px 44px',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow:
            '0 30px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 40px rgba(8, 127, 140, 0.2)',
          backdropFilter: 'blur(30px)',
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🧺</span>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#FFFDF5',
                letterSpacing: '1px',
              }}
            >
              MY KUSINA PANTRY
            </span>
          </div>

          <div
            style={{
              fontSize: '14px',
              fontFamily: 'monospace',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            ACTIVE_TAGS: {Math.min(5, Math.floor(frame / 15))}
          </div>
        </div>

        {/* Dynamic Ingredient Chips popping in on the beat */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '44px',
          }}
        >
          {INGREDIENTS.map((item, index) => {
            const itemDelay = 12 + index * 12;
            const popSpring = spring({
              frame: frame - itemDelay,
              fps,
              config: { damping: 12, stiffness: 220, mass: 0.6 },
            });
            const isVisible = frame >= itemDelay;

            return (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: `1.5px solid ${item.glow}88`,
                  boxShadow: isVisible
                    ? `0 0 25px ${item.glow}44, inset 0 1px 0 rgba(255,255,255,0.2)`
                    : 'none',
                  borderRadius: '100px',
                  padding: '16px 28px',
                  transform: `scale(${popSpring})`,
                  opacity: isVisible ? 1 : 0,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span style={{ fontSize: '32px' }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#FFFDF5',
                    letterSpacing: '0.5px',
                  }}
                >
                  {item.name}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: item.glow,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    fontWeight: 600,
                    marginLeft: '4px',
                  }}
                >
                  ✓
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Match Engine HUD */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(8, 127, 140, 0.25) 0%, rgba(244, 185, 66, 0.15) 100%)',
            borderRadius: 24,
            padding: '28px 36px',
            border: '1px solid rgba(12, 166, 183, 0.35)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '3px',
                color: '#0CA6B7',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}
            >
              AUTOMATIC RECIPE RESOLVER
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#FFFDF5',
              }}
            >
              150 Authentic Dishes Checked
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: '12px 28px',
              borderRadius: '18px',
              border: '1px solid rgba(244, 185, 66, 0.4)',
              boxShadow: '0 0 25px rgba(244, 185, 66, 0.25)',
            }}
          >
            <span
              style={{
                fontSize: '56px',
                fontWeight: 900,
                fontFamily: 'monospace',
                color: '#F4B942',
                lineHeight: 1,
              }}
            >
              {String(counterValue).padStart(2, '0')}
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.8)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              MATCHES
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
