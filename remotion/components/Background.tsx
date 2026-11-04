import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface BackgroundProps {
  glowColor?: string;
  intensity?: number;
}

export const Background: React.FC<BackgroundProps> = ({
  glowColor = '#087F8C',
  intensity = 1,
}) => {
  const frame = useCurrentFrame();

  // Gentle ambient floating effect
  const ambientY = interpolate(frame, [0, 630], [0, -120], {
    extrapolateRight: 'clamp',
  });

  // Dynamic subtle breathing glow
  const pulse = Math.sin(frame * 0.05) * 0.15 + 0.85;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#070D10',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Deep radial gradient glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          width: 1400,
          height: 1400,
          transform: `translate(-50%, -50%) scale(${pulse})`,
          background: `radial-gradient(circle, ${glowColor}25 0%, ${glowColor}08 40%, transparent 70%)`,
          filter: 'blur(80px)',
          opacity: intensity,
        }}
      />

      {/* Secondary warm palayok amber accent glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '20%',
          width: 1000,
          height: 1000,
          transform: 'translate(30%, 30%)',
          background:
            'radial-gradient(circle, rgba(244, 185, 66, 0.15) 0%, rgba(244, 185, 66, 0.03) 50%, transparent 75%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Subtle Starry Perspective Tech Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: `0px ${ambientY}px`,
          opacity: 0.8,
        }}
      />

      {/* Drifting Golden Steam / Ember Particles */}
      {Array.from({ length: 24 }).map((_, i) => {
        const seed = (i * 137.5) % 360;
        const leftPercent = (seed * 11) % 100;
        const speed = 1.2 + (i % 5) * 0.4;
        const startY = 1950 + (i * 90);
        const yPos = (startY - (frame * speed * 2.8)) % 2000;
        const size = 3 + (i % 4) * 2;
        const alpha = Math.sin((yPos / 2000) * Math.PI) * 0.7;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${leftPercent}%`,
              top: yPos,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: i % 3 === 0 ? '#F4B942' : i % 2 === 0 ? '#4F8A5B' : '#0CA6B7',
              boxShadow: `0 0 ${size * 3}px ${i % 3 === 0 ? '#F4B942' : '#0CA6B7'}`,
              opacity: Math.max(0, alpha),
            }}
          />
        );
      })}

      {/* Vignette border */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.8) 100%)',
        }}
      />
    </div>
  );
};
