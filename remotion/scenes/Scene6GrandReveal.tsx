import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene6GrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Grand entrance spring for app icon
  const iconSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 1 },
  });

  // Typography entrance
  const textSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // CTA button pop
  const ctaSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.7 },
  });

  // Specular light sweep across app icon
  const lightSweep = interpolate(frame, [10, 70], [-100, 200]);

  // Gentle floating oscillation
  const floatY = Math.sin(frame * 0.08) * 8;
  const pulseAura = 1 + Math.sin(frame * 0.1) * 0.08;

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
        zIndex: 10,
      }}
    >
      {/* Background Aura Glow behind App Icon */}
      <div
        style={{
          position: 'absolute',
          top: '32%',
          left: '50%',
          width: 700,
          height: 700,
          transform: `translate(-50%, -50%) scale(${pulseAura})`,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(8, 127, 140, 0.45) 0%, rgba(244, 185, 66, 0.25) 45%, transparent 75%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero App Icon Squircle */}
      <div
        style={{
          position: 'relative',
          width: 280,
          height: 280,
          borderRadius: 65,
          transform: `scale(${iconSpring}) translateY(${floatY}px)`,
          marginBottom: '44px',
          boxShadow:
            '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(8, 127, 140, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(255, 255, 255, 0.25)',
        }}
      >
        <Img
          src={staticFile('hapag-icon-hq.svg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />

        {/* Dynamic Specular Gleam Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.35) 50%, transparent 60%)',
            transform: `translateX(${lightSweep}%)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Brand Title & Tagline */}
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${textSpring})`,
          opacity: frame >= 12 ? 1 : 0,
          marginBottom: '36px',
        }}
      >
        <h1
          style={{
            fontSize: '92px',
            fontWeight: 900,
            letterSpacing: '8px',
            color: '#FFFDF5',
            margin: '0 0 10px 0',
            lineHeight: 1,
            textShadow:
              '0 0 40px rgba(8, 127, 140, 0.7), 0 10px 30px rgba(0, 0, 0, 0.9)',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Montserrat", sans-serif',
          }}
        >
          HAPAG
        </h1>

        <div
          style={{
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '3px',
            background: 'linear-gradient(90deg, #F4B942 0%, #FFFDF5 50%, #0CA6B7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Lutong Bahay, Engineered.
        </div>

        <p
          style={{
            fontSize: '22px',
            color: 'rgba(255, 253, 245, 0.8)',
            margin: 0,
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}
        >
          Discover 150 authentic Filipino dishes with what’s in your kitchen.
        </p>
      </div>

      {/* Feature Bullet Capsule Chips */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          marginBottom: '44px',
          opacity: frame >= 20 ? 1 : 0,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '10px 20px',
            borderRadius: '100px',
            fontSize: '15px',
            fontWeight: 600,
            color: '#FFFDF5',
            backdropFilter: 'blur(10px)',
          }}
        >
          🇵🇭 150 Filipino Recipes
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '10px 20px',
            borderRadius: '100px',
            fontSize: '15px',
            fontWeight: 600,
            color: '#FFFDF5',
            backdropFilter: 'blur(10px)',
          }}
        >
          🧺 Zero-Waste AI
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '10px 20px',
            borderRadius: '100px',
            fontSize: '15px',
            fontWeight: 600,
            color: '#FFFDF5',
            backdropFilter: 'blur(10px)',
          }}
        >
          ⏱️ Cooking HUD
        </div>
      </div>

      {/* High-Impact Glowing CTA Button */}
      <div
        style={{
          transform: `scale(${ctaSpring})`,
          opacity: frame >= 28 ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #F4B942 0%, #E25C3E 100%)',
            boxShadow:
              '0 15px 40px rgba(244, 185, 66, 0.5), 0 0 30px rgba(226, 92, 62, 0.4)',
            borderRadius: '100px',
            padding: '24px 64px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
          }}
        >
          <span
            style={{
              fontSize: '26px',
              fontWeight: 900,
              color: '#18323A',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            START COOKING TODAY
          </span>
          <span style={{ fontSize: '28px', color: '#18323A' }}>➔</span>
        </div>

        <div
          style={{
            fontSize: '22px',
            fontWeight: 800,
            fontFamily: 'monospace',
            color: '#0CA6B7',
            letterSpacing: '3px',
            textShadow: '0 0 20px rgba(12, 166, 183, 0.6)',
          }}
        >
          HAPAGAPP.COM
        </div>
      </div>
    </div>
  );
};
