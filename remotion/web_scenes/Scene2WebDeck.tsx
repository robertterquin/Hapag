import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PaperBackground } from '../components/PaperBackground';
import { WebShowreelFrame } from '../components/WebShowreelFrame';

interface RecipeCardData {
  category: string;
  title: string;
  time: string;
  steps: string;
  bgColor: string;
  rot: number;
  xOffset: number;
  isCenter?: boolean;
}

interface SceneProps {
  globalFrame?: number;
}

const CARDS: RecipeCardData[] = [
  {
    category: 'QUICK SAUTÉ',
    title: 'Tortang Talong with Crispy Garlic',
    time: '20 mins · ₱85',
    steps: '3 STEPS',
    bgColor: '#1A4D3B',
    rot: -12,
    xOffset: -430,
  },
  {
    category: 'SOUR SOUP',
    title: 'Sinigang na Baboy sa Sampalok',
    time: '45 mins · ₱180',
    steps: '4 STEPS',
    bgColor: '#1E3A8A',
    rot: -6,
    xOffset: -215,
  },
  {
    category: 'CLASSIC ULAM',
    title: 'Classic Chicken Adobo in Garlic & Vinegar',
    time: '35 mins · ₱140',
    steps: '4 STEPS',
    bgColor: '#202528',
    rot: 0,
    xOffset: 0,
    isCenter: true,
  },
  {
    category: 'TOMATO STEW',
    title: 'Chicken Afritada with Bell Pepper',
    time: '40 mins · ₱170',
    steps: '4 STEPS',
    bgColor: '#BA442B',
    rot: 6,
    xOffset: 215,
  },
  {
    category: 'COMFORT BOWL',
    title: 'Tinolang Manok with Dahon ng Sili',
    time: '35 mins · ₱150',
    steps: '4 STEPS',
    bgColor: '#0F575E',
    rot: 12,
    xOffset: 430,
  },
];

export const Scene2WebDeck: React.FC<SceneProps> = ({ globalFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for cards fanning out
  const fanSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.9 },
  });

  // Outro transition
  const outroOpacity = interpolate(frame, [78, 90], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroScale = interpolate(frame, [70, 90], [1, 0.95], {
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
        sceneNumber="02"
        sceneTitle="PICK"
        theme="light"
        globalFrame={globalFrame}
      />

      {/* Main Heading: Pick an ulam. */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 48,
          opacity: interpolate(frame, [0, 20], [0, 1]),
          transform: `translateY(${interpolate(frame, [0, 20], [30, 0])}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 76,
            fontWeight: 900,
            color: '#18323A',
            margin: 0,
            letterSpacing: '-1.5px',
            lineHeight: 1,
          }}
        >
          Pick an{' '}
          <span
            style={{
              fontFamily: '"Fraunces", "Playfair Display", "Georgia", serif',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#C84B31',
            }}
          >
            ulam.
          </span>
        </h2>
      </div>

      {/* Fanned 3D Deck of Recipe Cards */}
      <div
        style={{
          position: 'relative',
          width: 320,
          height: 480,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {CARDS.map((card, idx) => {
          const currentX = interpolate(fanSpring, [0, 1], [0, card.xOffset]);
          const currentRot = interpolate(fanSpring, [0, 1], [0, card.rot]);
          const currentY = card.isCenter ? -35 : 0;
          const currentScale = card.isCenter ? 1.06 : 1;
          const zIndex = card.isCenter ? 20 : 10 - Math.abs(idx - 2);

          return (
            <div
              key={card.title}
              style={{
                position: 'absolute',
                width: 310,
                height: 470,
                borderRadius: 26,
                backgroundColor: card.bgColor,
                color: '#FFFDF5',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: card.isCenter
                  ? '0 32px 80px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.18)'
                  : '0 20px 50px rgba(0, 0, 0, 0.28)',
                transform: `translateX(${currentX}px) translateY(${currentY}px) rotate(${currentRot}deg) scale(${currentScale})`,
                transformOrigin: '50% 120%',
                zIndex,
              }}
            >
              {/* Card Header Tag */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    color: '#FFFDF5',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '1.2px',
                    padding: '5px 12px',
                    borderRadius: 100,
                    textTransform: 'uppercase',
                  }}
                >
                  {card.category}
                </span>
                <span style={{ fontSize: 13, opacity: 0.8 }}>▷</span>
              </div>

              {/* Card Center Title in Serif Italic */}
              <div>
                <h3
                  style={{
                    fontFamily:
                      '"Fraunces", "Playfair Display", "Georgia", serif',
                    fontStyle: 'italic',
                    fontSize: 27,
                    fontWeight: 400,
                    lineHeight: 1.25,
                    margin: 0,
                    color: '#FFFDF5',
                  }}
                >
                  {card.title}
                </h3>
              </div>

              {/* Card Bottom Meta */}
              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                  paddingTop: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  color: 'rgba(255, 255, 255, 0.85)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>⏱</span>
                  <span>{card.time}</span>
                </div>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    letterSpacing: '1px',
                    fontWeight: 700,
                  }}
                >
                  {card.steps}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
