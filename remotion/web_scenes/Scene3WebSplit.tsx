import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PaperBackground } from '../components/PaperBackground';
import { WebShowreelFrame } from '../components/WebShowreelFrame';

interface SceneProps {
  globalFrame?: number;
}

const STEPS = [
  { step: 'STEP 1', title: 'Ginisang Bawang at Sibuyas sa Kawali', time: '5 min' },
  { step: 'STEP 2', title: 'I-sangkutsa ang Manok sa Toyo at Paminta', time: '8 min' },
  { step: 'STEP 3', title: 'Simmer sa Sukang Paombong nang hindi hinahalo', time: '15 min' },
  { step: 'STEP 4', title: 'Reduksyon ng Sarsa hanggang lumapot & Ihain', time: '7 min' },
];

export const Scene3WebSplit: React.FC<SceneProps> = ({ globalFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110, mass: 0.9 },
  });

  // Outro transition
  const outroOpacity = interpolate(frame, [92, 105], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroScale = interpolate(frame, [85, 105], [1, 0.97], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ring stroke progress
  const radius = 95;
  const circ = 2 * Math.PI * radius;
  const strokeOffset = interpolate(frame, [10, 55], [circ, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        transform: `scale(${outroScale})`,
        opacity: outroOpacity,
        zIndex: 10,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
      }}
    >
      {/* Frame overlay with split theme */}
      <WebShowreelFrame
        sceneNumber="03"
        sceneTitle="COOK"
        theme="split"
        globalFrame={globalFrame}
      />

      {/* Left 38% Full-bleed Column (Dark Charcoal) */}
      <div
        style={{
          width: '38%',
          height: '100%',
          backgroundColor: '#202528',
          padding: '110px 60px 110px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
          transform: `translateX(${interpolate(enterSpring, [0, 1], [-80, 0])}px)`,
        }}
      >
        {/* Top Tag & Title */}
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '2.5px',
              color: 'rgba(255, 255, 255, 0.55)',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
              marginBottom: 24,
            }}
          >
            LUTONG BAHAY · 4 STEPS · 35 MIN
          </div>
          <h2
            style={{
              fontFamily: '"Fraunces", "Playfair Display", "Georgia", serif',
              fontStyle: 'italic',
              fontSize: 54,
              fontWeight: 400,
              color: '#FFFDF5',
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: '-1px',
            }}
          >
            Classic Chicken Adobo in Garlic &amp; Vinegar
          </h2>
        </div>

        {/* Bottom Area: Circular Meter & Focus Timer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
          }}
        >
          {/* Animated 100% Circle Gauge */}
          <div
            style={{
              position: 'relative',
              width: 170,
              height: 170,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              viewBox="0 0 220 220"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: 'rotate(-90deg)',
              }}
            >
              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="14"
                fill="none"
              />
              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke="#34D399"
                strokeWidth="14"
                strokeDasharray={circ}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: '#FFFDF5',
                  lineHeight: 1,
                }}
              >
                100%
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '2px',
                  color: '#34D399',
                  textTransform: 'uppercase',
                  marginTop: 6,
                }}
              >
                MATCHED
              </div>
            </div>
          </div>

          {/* Focus Timer */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '2px',
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'uppercase',
                marginBottom: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>⏱</span>
              <span>FOCUS TIMER</span>
            </div>
            <div
              style={{
                fontSize: 54,
                fontWeight: 900,
                fontFamily: 'monospace, sans-serif',
                color: '#FFFDF5',
                lineHeight: 1,
              }}
            >
              18:30
            </div>
          </div>
        </div>
      </div>

      {/* Right 62% Full-bleed Column (Warm Bone Paper) */}
      <div
        style={{
          width: '62%',
          height: '100%',
          backgroundColor: '#F5F2EA',
          position: 'relative',
          padding: '110px 100px 110px 90px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: `translateX(${interpolate(enterSpring, [0, 1], [60, 0])}px)`,
        }}
      >
        <PaperBackground />

        {/* Right Header */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderBottom: '1px solid rgba(24, 50, 58, 0.1)',
            paddingBottom: 24,
          }}
        >
          <h3
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: '#18323A',
              margin: 0,
              letterSpacing: '-1.5px',
            }}
          >
            Your path
          </h3>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 14,
              fontWeight: 800,
              color: '#5C6E74',
              letterSpacing: '1.5px',
            }}
          >
            4 / 4 STEPS GROUNDED
          </span>
        </div>

        {/* Connected Timeline Steps with vertical rail */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 36,
            paddingLeft: 12,
          }}
        >
          {/* Vertical connecting rail line */}
          <div
            style={{
              position: 'absolute',
              left: 31,
              top: 24,
              bottom: 24,
              width: 3,
              backgroundColor: '#1E4E3A',
              opacity: 0.4,
              zIndex: 0,
            }}
          />

          {STEPS.map((s, i) => {
            const stepDelay = 12 + i * 12;
            const isRevealed = frame >= stepDelay;

            return (
              <div
                key={s.step}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: isRevealed ? 1 : 0.25,
                  transform: `translateX(${isRevealed ? 0 : 25}px)`,
                  transition: 'opacity 0.25s, transform 0.25s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                  {/* Step Check Circle */}
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      backgroundColor: '#1E4E3A',
                      color: '#FFFDF5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 900,
                      boxShadow: '0 4px 12px rgba(30, 78, 58, 0.25)',
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: '2px',
                        color: '#087F8C',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      {s.step}
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: '#18323A',
                        lineHeight: 1.25,
                      }}
                    >
                      {s.title}
                    </div>
                  </div>
                </div>

                {/* Duration Badge Pill */}
                <div
                  style={{
                    backgroundColor: '#E3F2E9',
                    color: '#1E4E3A',
                    padding: '8px 18px',
                    borderRadius: 100,
                    fontFamily: 'monospace',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                    flexShrink: 0,
                  }}
                >
                  {s.time}
                </div>
              </div>
            );
          })}
        </div>

        {/* Small bottom filler for layout balance */}
        <div style={{ height: 1 }} />
      </div>
    </div>
  );
};
