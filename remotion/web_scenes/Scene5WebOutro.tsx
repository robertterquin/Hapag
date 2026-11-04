import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { WebShowreelFrame } from '../components/WebShowreelFrame';

interface SceneProps {
  globalFrame?: number;
}

export const Scene5WebOutro: React.FC<SceneProps> = ({ globalFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Slow ambient rotation of sunburst rays
  const sunburstRot = interpolate(frame, [0, 75], [0, 8]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F5F2EA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 10,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
      }}
    >
      {/* Sunburst Background Rays (Skillora signature outro) */}
      <div
        style={{
          position: 'absolute',
          width: 2800,
          height: 2800,
          transform: `rotate(${sunburstRot}deg)`,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 1000 1000" style={{ width: '100%', height: '100%' }}>
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            return (
              <path
                key={i}
                d={`M 500 500 L ${500 + 1000 * Math.cos((angle * Math.PI) / 180)} ${
                  500 + 1000 * Math.sin((angle * Math.PI) / 180)
                } A 1000 1000 0 0 1 ${
                  500 + 1000 * Math.cos(((angle + 7.5) * Math.PI) / 180)
                } ${500 + 1000 * Math.sin(((angle + 7.5) * Math.PI) / 180)} Z`}
                fill={i % 2 === 0 ? 'rgba(235, 227, 212, 0.45)' : 'transparent'}
              />
            );
          })}
        </svg>
      </div>

      {/* Frame Overlay */}
      <WebShowreelFrame
        sceneNumber="05"
        sceneTitle="HAPAG"
        theme="light"
        globalFrame={globalFrame}
      />

      {/* Center Content Stack */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${enterSpring})`,
          zIndex: 5,
        }}
      >
        {/* Elevated App Icon */}
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: 32,
            boxShadow:
              '0 24px 60px rgba(8, 127, 140, 0.3), 0 0 0 1px rgba(24, 50, 58, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            overflow: 'hidden',
          }}
        >
          <Img
            src={staticFile('hapag-icon-hq.svg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Brand Name */}
        <h1
          style={{
            fontSize: 98,
            fontWeight: 900,
            color: '#18323A',
            letterSpacing: '-2px',
            margin: '0 0 8px 0',
            lineHeight: 1,
          }}
        >
          Hapag
        </h1>

        {/* Tagline */}
        <div
          style={{
            fontFamily: '"Fraunces", "Playfair Display", "Georgia", serif',
            fontStyle: 'italic',
            fontSize: 34,
            color: '#18323A',
            marginBottom: 24,
          }}
        >
          A place to master your next{' '}
          <span style={{ color: '#C84B31' }}>lutong bahay.</span>
        </div>

        {/* Subline Pill */}
        <div
          style={{
            backgroundColor: '#C84B31',
            color: '#FFFDF5',
            padding: '10px 24px',
            borderRadius: 100,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            boxShadow: '0 6px 20px rgba(200, 75, 49, 0.3)',
          }}
        >
          HAPAGAPP.COM
        </div>
      </div>
    </div>
  );
};
