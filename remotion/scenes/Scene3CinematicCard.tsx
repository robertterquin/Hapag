import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene3CinematicCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.9 },
  });

  // Outro transition
  const outroOpacity = interpolate(frame, [93, 105], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroZoom = interpolate(frame, [88, 105], [1, 1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3D Card Dynamics (Floating & tilting)
  const rotY = interpolate(frame, [0, 105], [-10, 6]);
  const rotX = interpolate(frame, [0, 105], [8, -4]);
  const floatY = Math.sin(frame * 0.08) * 12;

  // Specular light sweep across card surface
  const lightSweep = interpolate(frame, [15, 85], [-120, 220]);

  // Match meter animation (0 to 94%)
  const matchPct = Math.round(
    interpolate(frame, [20, 65], [0, 94], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
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
        perspective: 1400,
        transform: `scale(${outroZoom})`,
        opacity: outroOpacity,
        zIndex: 10,
      }}
    >
      {/* Scene Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '32px',
          opacity: interpolate(frame, [0, 25], [0, 1]),
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 800,
            letterSpacing: '5px',
            color: '#F4B942',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          AUTHENTIC MATCH FOUND
        </div>
        <h2
          style={{
            fontSize: '56px',
            fontWeight: 900,
            color: '#FFFDF5',
            margin: 0,
            letterSpacing: '-1px',
          }}
        >
          GROUNDED CULINARY INTEL
        </h2>
      </div>

      {/* 3D Perspective Hero Recipe Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 900,
          borderRadius: 40,
          background: 'rgba(10, 20, 26, 0.88)',
          border: '1.5px solid rgba(255, 255, 255, 0.16)',
          boxShadow:
            '0 40px 100px rgba(0, 0, 0, 0.85), 0 0 50px rgba(8, 127, 140, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          overflow: 'hidden',
          transform: `scale(${enterSpring}) rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(${floatY}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Specular Light Sweep Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.18) 50%, transparent 60%)`,
            transform: `translateX(${lightSweep}%)`,
            pointerEvents: 'none',
            zIndex: 15,
          }}
        />

        {/* Hero Food Photography Header */}
        <div
          style={{
            position: 'relative',
            height: 480,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <Img
            src={staticFile('chicken-adobo.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${interpolate(frame, [0, 105], [1, 1.08])})`,
            }}
          />

          {/* Gradient darkness overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(7, 13, 16, 0.2) 0%, rgba(7, 13, 16, 0.85) 100%)',
            }}
          />

          {/* Floating Frosted Glass Pills */}
          <div
            style={{
              position: 'absolute',
              top: 32,
              left: 36,
              display: 'flex',
              gap: '14px',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(244, 185, 66, 0.95)',
                color: '#18323A',
                fontWeight: 800,
                fontSize: '15px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '8px 20px',
                borderRadius: '100px',
                boxShadow: '0 4px 20px rgba(244, 185, 66, 0.5)',
              }}
            >
              ★ CLASSIC ULAM
            </div>

            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#FFFDF5',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: 700,
                fontSize: '15px',
                padding: '8px 20px',
                borderRadius: '100px',
              }}
            >
              ⏱️ 35 MINS
            </div>
          </div>

          {/* Price Badge on Top Right */}
          <div
            style={{
              position: 'absolute',
              top: 32,
              right: 36,
              backgroundColor: 'rgba(8, 127, 140, 0.85)',
              border: '1px solid rgba(12, 166, 183, 0.4)',
              color: '#FFFDF5',
              backdropFilter: 'blur(16px)',
              padding: '10px 22px',
              borderRadius: '100px',
              fontWeight: 800,
              fontSize: '16px',
              boxShadow: '0 4px 20px rgba(8, 127, 140, 0.4)',
            }}
          >
            ₱140 / 4 SERVINGS
          </div>

          {/* Dish Title on food image bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 28,
              left: 36,
              right: 36,
            }}
          >
            <h3
              style={{
                fontSize: '52px',
                fontWeight: 900,
                color: '#FFFDF5',
                margin: '0 0 6px 0',
                letterSpacing: '-1px',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              }}
            >
              Adobong Manok
            </h3>
            <p
              style={{
                fontSize: '20px',
                color: 'rgba(255, 253, 245, 0.85)',
                margin: 0,
                fontWeight: 500,
              }}
            >
              Classic Filipino braised chicken in cane vinegar, garlic & soy sauce.
            </p>
          </div>
        </div>

        {/* Card Body & Match Diagnostics */}
        <div style={{ padding: '36px 40px' }}>
          {/* Calamansi Match Bar */}
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🍋</span>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    letterSpacing: '2px',
                    color: '#4F8A5B',
                    textTransform: 'uppercase',
                  }}
                >
                  PANTRY MATCH LEVEL
                </span>
              </div>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  color: '#4F8A5B',
                }}
              >
                {matchPct}%
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 100,
                overflow: 'hidden',
                border: '1px solid rgba(79, 138, 91, 0.3)',
              }}
            >
              <div
                style={{
                  width: `${matchPct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4F8A5B 0%, #22C55E 100%)',
                  borderRadius: 100,
                  boxShadow: '0 0 15px rgba(34, 197, 94, 0.6)',
                }}
              />
            </div>
          </div>

          {/* Smart Substitution / Chef Kalabaw AI Grounding Tip */}
          <div
            style={{
              backgroundColor: 'rgba(8, 127, 140, 0.14)',
              border: '1px solid rgba(12, 166, 183, 0.3)',
              borderRadius: 20,
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span style={{ fontSize: '30px' }}>💡</span>
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#0CA6B7',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  marginBottom: '2px',
                }}
              >
                CHEF KALABAW SUBSTITUTION INTEL
              </div>
              <div
                style={{
                  fontSize: '17px',
                  color: '#FFFDF5',
                  fontWeight: 500,
                }}
              >
                No laurel on hand? Use extra freshly cracked black peppercorn.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
