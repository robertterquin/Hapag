import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene1NeonPalayok: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro fade in & zoom
  const introScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.8 },
  });

  // Outro transition (zoom-in blast towards frame 105)
  const outroScale = interpolate(frame, [88, 105], [1, 1.45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroOpacity = interpolate(frame, [95, 105], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // SVG Neon Wireframe Stroke Draw (0 to 1000)
  const strokeProgress = interpolate(frame, [10, 65], [1200, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Glowing core pulse
  const glowOpacity = interpolate(frame, [35, 75], [0, 0.9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Kinetic typography reveals
  const titleY = interpolate(frame, [25, 60], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleOpacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [45, 70], [0, 1], {
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
        transform: `scale(${introScale * outroScale})`,
        opacity: outroOpacity,
        zIndex: 10,
      }}
    >
      {/* Central Neon Palayok Wireframe */}
      <div
        style={{
          position: 'relative',
          width: 540,
          height: 480,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '50px',
        }}
      >
        {/* Ambient Backlight Halo */}
        <div
          style={{
            position: 'absolute',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(244,185,66,0.35) 0%, rgba(8,127,140,0.2) 50%, transparent 70%)',
            filter: 'blur(50px)',
            opacity: glowOpacity,
          }}
        />

        <svg
          viewBox="0 0 400 360"
          style={{
            width: '100%',
            height: '100%',
            filter: 'drop-shadow(0 0 15px rgba(244, 185, 66, 0.8)) drop-shadow(0 0 35px rgba(8, 127, 140, 0.6))',
          }}
        >
          {/* Wireframe Steaming Wisps */}
          <path
            d="M 160 110 C 145 80, 175 60, 160 30"
            stroke="#0CA6B7"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={300}
            strokeDashoffset={strokeProgress * 0.4}
            opacity="0.85"
          />
          <path
            d="M 200 100 C 185 70, 215 50, 200 20"
            stroke="#F4B942"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={300}
            strokeDashoffset={strokeProgress * 0.35}
          />
          <path
            d="M 240 110 C 225 80, 255 60, 240 30"
            stroke="#0CA6B7"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={300}
            strokeDashoffset={strokeProgress * 0.4}
            opacity="0.85"
          />

          {/* Wireframe Pot Rim */}
          <ellipse
            cx="200"
            cy="140"
            rx="140"
            ry="30"
            stroke="#F4B942"
            strokeWidth="6"
            fill="none"
            strokeDasharray={1000}
            strokeDashoffset={strokeProgress}
          />

          {/* Wireframe Inner Broth Ring */}
          <ellipse
            cx="200"
            cy="142"
            rx="120"
            ry="22"
            stroke="#0CA6B7"
            strokeWidth="4"
            fill="none"
            strokeDasharray={800}
            strokeDashoffset={strokeProgress * 0.8}
            opacity="0.7"
          />

          {/* Wireframe Pot Belly */}
          <path
            d="M 65 145 C 55 240, 120 310, 200 310 C 280 310, 345 240, 335 145"
            stroke="#F4B942"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={1200}
            strokeDashoffset={strokeProgress}
          />

          {/* Pot Handles */}
          <path
            d="M 68 155 C 35 155, 35 185, 68 185"
            stroke="#FFFDF5"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={200}
            strokeDashoffset={strokeProgress * 0.3}
          />
          <path
            d="M 332 155 C 365 155, 365 185, 332 185"
            stroke="#FFFDF5"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={200}
            strokeDashoffset={strokeProgress * 0.3}
          />

          {/* Base Stand */}
          <path
            d="M 120 310 Q 200 330 280 310"
            stroke="#0CA6B7"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={400}
            strokeDashoffset={strokeProgress * 0.5}
          />
        </svg>

        {/* Center Scanner Crosshair */}
        <div
          style={{
            position: 'absolute',
            width: 80,
            height: 80,
            border: '1px dashed rgba(12, 166, 183, 0.4)',
            borderRadius: '50%',
            opacity: glowOpacity * 0.7,
            animation: 'spin 10s linear infinite',
          }}
        />
      </div>

      {/* Kinetic Typography */}
      <div
        style={{
          textAlign: 'center',
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          padding: '0 40px',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(244, 185, 66, 0.12)',
            border: '1px solid rgba(244, 185, 66, 0.35)',
            color: '#F4B942',
            padding: '8px 24px',
            borderRadius: '100px',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '24px',
            backdropFilter: 'blur(10px)',
          }}
        >
          FILIPINO CULINARY ENGINE
        </div>

        <h1
          style={{
            fontSize: '76px',
            fontWeight: 900,
            color: '#FFFDF5',
            letterSpacing: '-2px',
            lineHeight: 1.05,
            textTransform: 'uppercase',
            margin: '0 0 20px 0',
            textShadow: '0 0 40px rgba(8, 127, 140, 0.5), 0 10px 30px rgba(0,0,0,0.8)',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Montserrat", sans-serif',
          }}
        >
          WHAT’S IN YOUR <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #F4B942 0%, #E25C3E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 25px rgba(244, 185, 66, 0.5))',
            }}
          >
            KUSINA?
          </span>
        </h1>

        <p
          style={{
            fontSize: '28px',
            color: 'rgba(255, 253, 245, 0.75)',
            fontWeight: 500,
            margin: 0,
            opacity: subtitleOpacity,
            letterSpacing: '0.5px',
          }}
        >
          No grocery run needed. Turn everyday staples into authentic ulam.
        </p>
      </div>
    </div>
  );
};
