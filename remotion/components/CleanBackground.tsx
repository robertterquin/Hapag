import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const CleanBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle warm ambient breathing light (like a cozy kitchen/studio light)
  const ambientPulse = Math.sin(frame * 0.04) * 0.05 + 0.95;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#0F1518',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Soft warm terracotta / amber studio glow at top */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          width: 1300,
          height: 1300,
          transform: `translateX(-50%) scale(${ambientPulse})`,
          background:
            'radial-gradient(circle, rgba(244, 185, 66, 0.12) 0%, rgba(200, 75, 49, 0.06) 40%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Subtle calming teal ambient glow at bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: 900,
          height: 900,
          background:
            'radial-gradient(circle, rgba(8, 127, 140, 0.1) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Gentle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, transparent 60%, rgba(0, 0, 0, 0.65) 100%)',
        }}
      />
    </div>
  );
};
