import React from 'react';
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ChefKalabawSVG } from '../components/ChefKalabawSVG';

export const Scene5HumanOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance springs
  const mascotSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });

  const iconSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.8 },
  });

  const ctaSpring = spring({
    frame: frame - 32,
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.7 },
  });

  // Soft breathing float
  const floatY = Math.sin(frame * 0.08) * 6;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 50px',
        zIndex: 10,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
      }}
    >
      {/* Warm Chef Kalabaw celebration */}
      <div
        style={{
          transform: `scale(${mascotSpring}) translateY(${floatY}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <ChefKalabawSVG size={260} winking={true} />

        <div
          style={{
            marginTop: -6,
            backgroundColor: 'rgba(255, 253, 245, 0.96)',
            border: '1.5px solid #F4B942',
            padding: '8px 26px',
            borderRadius: 100,
            fontSize: 17,
            fontWeight: 800,
            color: '#18323A',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>🍲</span>
          <span>Luto na! Kain na tayo!</span>
        </div>
      </div>

      {/* Hero App Icon Squircle */}
      <div
        style={{
          transform: `scale(${iconSpring})`,
          opacity: frame >= 14 ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: 42,
            boxShadow:
              '0 25px 70px rgba(0, 0, 0, 0.65), 0 0 0 2px rgba(255, 255, 255, 0.25)',
            overflow: 'hidden',
            marginBottom: 20,
            backgroundColor: '#087F8C',
          }}
        >
          <Img
            src={staticFile('hapag-icon-hq.svg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Brand Name & Tagline */}
        <h1
          style={{
            fontSize: 78,
            fontWeight: 900,
            color: '#FFFDF5',
            letterSpacing: '6px',
            margin: '0 0 8px 0',
            lineHeight: 1,
            textShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
          }}
        >
          HAPAG
        </h1>

        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#F4B942',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Lutong Bahay, Engineered.
        </div>

        <p
          style={{
            fontSize: 22,
            color: 'rgba(255, 253, 245, 0.8)',
            margin: 0,
            fontWeight: 400,
            textAlign: 'center',
            maxWidth: 680,
            lineHeight: 1.4,
          }}
        >
          150 authentic Filipino recipes grounded in what’s already in your kitchen.
        </p>
      </div>

      {/* Clean Feature Badges */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 36,
          opacity: frame >= 22 ? 1 : 0,
        }}
      >
        <span
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#FFFDF5',
            fontSize: 15,
            fontWeight: 600,
            padding: '8px 18px',
            borderRadius: 100,
          }}
        >
          🇵🇭 150 Classic Dishes
        </span>
        <span
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#FFFDF5',
            fontSize: 15,
            fontWeight: 600,
            padding: '8px 18px',
            borderRadius: 100,
          }}
        >
          🧺 Zero-Waste AI
        </span>
        <span
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#FFFDF5',
            fontSize: 15,
            fontWeight: 600,
            padding: '8px 18px',
            borderRadius: 100,
          }}
        >
          ⏱️ Cooking Timer
        </span>
      </div>

      {/* Call To Action */}
      <div
        style={{
          transform: `scale(${ctaSpring})`,
          opacity: frame >= 28 ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            backgroundColor: '#087F8C',
            color: '#FFFDF5',
            padding: '20px 54px',
            borderRadius: 100,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '1px',
            boxShadow:
              '0 12px 35px rgba(8, 127, 140, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span>SIMULAN MAGLUTO NGAYON</span>
          <span style={{ fontSize: 24 }}>➔</span>
        </div>

        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '2.5px',
            color: '#F4B942',
            fontFamily: 'monospace, sans-serif',
          }}
        >
          HAPAGAPP.COM
        </div>
      </div>
    </div>
  );
};
