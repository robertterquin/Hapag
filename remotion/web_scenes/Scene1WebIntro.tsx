import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { WebShowreelFrame } from '../components/WebShowreelFrame';

interface SceneProps {
  globalFrame?: number;
}

export const Scene1WebIntro: React.FC<SceneProps> = ({ globalFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Typography entrance
  const textSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Outro iris wipe / scale
  const outroScale = interpolate(frame, [60, 75], [1, 2.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroOpacity = interpolate(frame, [65, 75], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#C84B31',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transform: `scale(${outroScale})`,
        opacity: outroOpacity,
        zIndex: 10,
      }}
    >
      {/* Background paper warmth & vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, rgba(244, 185, 66, 0.2) 0%, rgba(156, 52, 29, 0.5) 100%)',
        }}
      />

      {/* Frame overlay */}
      <WebShowreelFrame
        sceneNumber="01"
        sceneTitle="KUSINA"
        theme="terracotta"
        globalFrame={globalFrame}
      />

      {/* Center Left Category marker */}
      <div
        style={{
          position: 'absolute',
          left: 48,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 14,
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.75)',
          letterSpacing: '3px',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
        }}
      >
        01 / LUTONG BAHAY
      </div>

      {/* Center Big Typography */}
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${textSpring})`,
        }}
      >
        <h1
          style={{
            fontSize: 160,
            fontFamily: '"Fraunces", "Playfair Display", "Georgia", serif',
            fontStyle: 'italic',
            fontWeight: 400,
            color: '#FFFDF5',
            margin: 0,
            lineHeight: 1,
            letterSpacing: '-2px',
            textShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
          }}
        >
          Kusina
        </h1>
      </div>

      {/* Tiny decorative diamond sparkle */}
      <div
        style={{
          position: 'absolute',
          right: 90,
          top: '52%',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 20,
        }}
      >
        ✦
      </div>
    </div>
  );
};
