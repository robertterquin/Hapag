import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ChefKalabawSVG } from '../components/ChefKalabawSVG';

export const Scene5TriumphLutoNa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snare hit entrance spring
  const triumphSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.8 },
  });

  // Outro transition
  const outroOpacity = interpolate(frame, [78, 90], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroScale = interpolate(frame, [70, 90], [1, 0.9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Mascot entrance spring
  const mascotSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.9 },
  });

  // Leftover card entrance
  const leftoverSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 16, stiffness: 110, mass: 0.8 },
  });

  // Sparkle burst expansion
  const burstScale = interpolate(frame, [0, 45], [0.3, 1.8], {
    extrapolateRight: 'clamp',
  });
  const burstOpacity = interpolate(frame, [0, 15, 60], [0, 0.8, 0.2]);

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
        transform: `scale(${outroScale})`,
        opacity: outroOpacity,
        zIndex: 10,
      }}
    >
      {/* Background Golden Shockwave Aura */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          width: 800,
          height: 800,
          transform: `translate(-50%, -50%) scale(${burstScale})`,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(244, 185, 66, 0.4) 0%, rgba(226, 92, 62, 0.2) 40%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: burstOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Kinetic Headline: LUTO NA! */}
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${triumphSpring})`,
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(244, 185, 66, 0.2)',
            border: '1.5px solid rgba(244, 185, 66, 0.5)',
            color: '#F4B942',
            padding: '8px 24px',
            borderRadius: '100px',
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          COOKING COMPLETED // KAIN NA TAYO!
        </div>

        <h2
          style={{
            fontSize: '98px',
            fontWeight: 900,
            color: '#FFFDF5',
            margin: 0,
            lineHeight: 1,
            letterSpacing: '-2px',
            textShadow:
              '0 0 50px rgba(244, 185, 66, 0.8), 0 10px 40px rgba(0, 0, 0, 0.9)',
          }}
        >
          🎉 LUTO NA!
        </h2>
      </div>

      {/* Chef Kalabaw Mascot in action */}
      <div
        style={{
          transform: `scale(${mascotSpring})`,
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <ChefKalabawSVG size={340} winking={true} />

        <div
          style={{
            marginTop: '-10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(244, 185, 66, 0.4)',
            padding: '6px 20px',
            borderRadius: '100px',
            fontSize: '15px',
            fontWeight: 700,
            color: '#F4B942',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🐃</span>
          <span>Chef Kalabaw Approves • Amoy Palayok Perfection!</span>
        </div>
      </div>

      {/* Leftover Magic Smart Suggestion Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          background: 'rgba(12, 24, 30, 0.85)',
          border: '1.5px solid rgba(12, 166, 183, 0.4)',
          borderRadius: 28,
          padding: '28px 36px',
          boxShadow:
            '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(8, 127, 140, 0.25)',
          backdropFilter: 'blur(20px)',
          transform: `scale(${leftoverSpring}) translateY(${interpolate(
            leftoverSpring,
            [0, 1],
            [40, 0]
          )}px)`,
          opacity: frame >= 25 ? 1 : 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>💡</span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '2px',
                color: '#0CA6B7',
                textTransform: 'uppercase',
              }}
            >
              ZERO-WASTE LEFTOVER ENGINE
            </span>
          </div>

          <div
            style={{
              fontSize: '13px',
              fontFamily: 'monospace',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            NEXT_DAY_SYNC
          </div>
        </div>

        <div
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#FFFDF5',
            lineHeight: 1.35,
            marginBottom: '12px',
          }}
        >
          “May tirang Adobo? Gisingin bukas bilang malutong na Sinangag with crispy garlic flakes!”
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(8, 127, 140, 0.2)',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#0CA6B7',
          }}
        >
          <span>🍚</span>
          <span>Transforms into: Adobo Fried Rice (Sinangag)</span>
        </div>
      </div>
    </div>
  );
};
