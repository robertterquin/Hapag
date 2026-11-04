import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PaperBackground } from '../components/PaperBackground';
import { WebShowreelFrame } from '../components/WebShowreelFrame';

interface SceneProps {
  globalFrame?: number;
}

export const Scene4WebBento: React.FC<SceneProps> = ({ globalFrame }) => {
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
  const outroScale = interpolate(frame, [85, 105], [1, 0.96], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${outroScale})`,
        opacity: outroOpacity,
        zIndex: 10,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
      }}
    >
      <PaperBackground />
      <WebShowreelFrame
        sceneNumber="04"
        sceneTitle="KUSINA INTELLIGENCE"
        theme="light"
        globalFrame={globalFrame}
      />

      {/* Main Heading: Built for every kusina. */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 36,
          opacity: interpolate(frame, [0, 20], [0, 1]),
          transform: `translateY(${interpolate(frame, [0, 20], [20, 0])}px)`,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '2.5px',
            color: '#7B8E95',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 6,
          }}
        >
          BETWEEN MEALS
        </span>
        <h2
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: '#18323A',
            margin: 0,
            letterSpacing: '-1.5px',
            lineHeight: 1,
          }}
        >
          Built for every{' '}
          <span
            style={{
              fontFamily: '"Fraunces", "Playfair Display", "Georgia", serif',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#C84B31',
            }}
          >
            kusina.
          </span>
        </h2>
      </div>

      {/* Bento Grid Container */}
      <div
        style={{
          width: 1540,
          height: 600,
          display: 'grid',
          gridTemplateColumns: '380px 1fr 380px',
          gridTemplateRows: '1fr 1fr',
          gap: 24,
          transform: `scale(${enterSpring})`,
        }}
      >
        {/* Card 1: Left Dark Timer Card (Spans 2 rows) */}
        <div
          style={{
            gridRow: '1 / span 2',
            backgroundColor: '#1E2327',
            borderRadius: 32,
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            color: '#FFFDF5',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '2px',
              color: 'rgba(255, 255, 255, 0.6)',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>⏱</span>
            <span>STOVE FOCUS TIMER</span>
          </div>

          {/* Circular Countdown Watch face */}
          <div
            style={{
              position: 'relative',
              width: 260,
              height: 260,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              viewBox="0 0 200 200"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: 'rotate(-90deg)',
              }}
            >
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="#C84B31"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 85}
                strokeDashoffset={2 * Math.PI * 85 * 0.35}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  fontFamily: 'monospace, sans-serif',
                  letterSpacing: '-1px',
                  color: '#FFFDF5',
                }}
              >
                18:30
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#C84B31',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  marginTop: 4,
                }}
              >
                ● ACTIVE SIMMER
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: '"Fraunces", "Playfair Display", "Georgia", serif',
                fontStyle: 'italic',
                fontSize: 26,
                fontWeight: 400,
                color: '#FFFDF5',
                marginBottom: 4,
              }}
            >
              Simmer sa suka
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'rgba(255, 255, 255, 0.65)',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              HAKBANG 3 · 15 MIN
            </div>
          </div>
        </div>

        {/* Card 2: Center Top - Weekly Recap */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 30,
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 35px rgba(24, 50, 58, 0.06)',
            border: '1px solid rgba(24, 50, 58, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '1.5px',
                color: '#7B8E95',
                textTransform: 'uppercase',
              }}
            >
              WEEKLY RECAP
            </span>
            <span
              style={{
                backgroundColor: '#E8F5E9',
                color: '#2E7D32',
                padding: '4px 12px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              +₱420 SAVED
            </span>
          </div>

          <div
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: '#18323A',
            }}
          >
            5{' '}
            <span
              style={{
                fontFamily: '"Fraunces", "Playfair Display", "Georgia", serif',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              meals cooked at home
            </span>
          </div>

          {/* Mini Bar Chart */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              height: 70,
              paddingTop: 10,
            }}
          >
            {[
              { d: 'M', h: 35 },
              { d: 'T', h: 50 },
              { d: 'W', h: 10 },
              { d: 'T', h: 60 },
              { d: 'F', h: 40 },
              { d: 'S', h: 80, active: true },
              { d: 'S', h: 30 },
            ].map((bar, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: bar.h,
                    backgroundColor: bar.active ? '#C84B31' : '#18323A',
                    borderRadius: 10,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#7B8E95',
                  }}
                >
                  {bar.d}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Right Top - Terracotta Reminders */}
        <div
          style={{
            backgroundColor: '#C84B31',
            borderRadius: 30,
            padding: '28px 30px',
            color: '#FFFDF5',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 16px 40px rgba(200, 75, 49, 0.25)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.75)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>🔔</span>
            <span>LEFTOVER INTELLIGENCE</span>
          </div>

          {/* Notification capsule */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#18323A',
              borderRadius: 18,
              padding: '16px 18px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#7B8E95',
                marginBottom: 4,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>HAPAG</span>
              <span>7:30 AM</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>
              May tirang adobo? Gawing crispy Sinangag with bawang flakes!
            </div>
          </div>

          <div
            style={{
              fontFamily: '"Fraunces", "Playfair Display", "Georgia", serif',
              fontStyle: 'italic',
              fontSize: 20,
              color: '#FFFDF5',
              opacity: 0.9,
            }}
          >
            Zero food waste.
          </div>
        </div>

        {/* Card 4: Center Bottom - Sari-sari substitutions */}
        <div
          style={{
            backgroundColor: '#EBE5D8',
            borderRadius: 30,
            padding: '26px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '1.5px',
              color: '#7B8E95',
              textTransform: 'uppercase',
            }}
          >
            SARI-SARI PAMALIT
          </div>

          <div
            style={{
              fontFamily: '"Fraunces", "Playfair Display", "Georgia", serif',
              fontStyle: 'italic',
              fontSize: 28,
              color: '#18323A',
            }}
          >
            Real ingredients that work.
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 700,
                color: '#087F8C',
              }}
            >
              Patatas ➔ Tokwa
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 700,
                color: '#087F8C',
              }}
            >
              Suka ➔ Calamansi
            </div>
          </div>
        </div>

        {/* Card 5: Right Bottom - Chef Kalabaw's Seal */}
        <div
          style={{
            backgroundColor: '#1E2327',
            borderRadius: 30,
            padding: '26px 30px',
            color: '#FFFDF5',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#F4B942',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>★</span>
            <span>CHEF KALABAW&apos;S SEAL</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span style={{ fontSize: 44 }}>🍲</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#FFFDF5' }}>
                100% Sarap Guaranteed
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                Amoy palayok at timplang lutong bahay.
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(244, 185, 66, 0.15)',
              border: '1px solid rgba(244, 185, 66, 0.3)',
              color: '#F4B942',
              padding: '6px 14px',
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 700,
              width: 'fit-content',
            }}
          >
            <span>✓</span>
            <span>150 Pinoy Dishes Tested</span>
          </div>
        </div>
      </div>
    </div>
  );
};
