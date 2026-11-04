import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const COOKING_STEPS = [
  { label: 'Gisahin ang Bawang', status: 'done' },
  { label: 'I-sangkutsa ang Manok', status: 'done' },
  { label: 'Pababain ang Apoy & Simmer', status: 'active' },
  { label: 'Ihain at I-enjoy', status: 'pending' },
];

export const Scene4DigitalTimer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.8 },
  });

  // Outro transition
  const outroOpacity = interpolate(frame, [108, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroScale = interpolate(frame, [100, 120], [1, 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Countdown timer math: simulates ticking down from 20:00
  // Each second ticks down every 10 frames for video punchiness!
  const totalSecondsRemaining = Math.max(
    0,
    1200 - Math.floor(frame * 1.5)
  );
  const minutes = Math.floor(totalSecondsRemaining / 60);
  const seconds = totalSecondsRemaining % 60;
  const timerString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Radial SVG Ring Progress
  const radius = 170;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = interpolate(frame, [0, 120], [circumference * 0.1, circumference * 0.45]);

  // Subtle rhythmic pulse on every second tick
  const tickPulse = 1 + Math.sin(frame * 0.8) * 0.02;

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
        transform: `scale(${enterSpring * outroScale})`,
        opacity: outroOpacity,
        zIndex: 10,
      }}
    >
      {/* HUD Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(244, 185, 66, 0.15)',
            border: '1.5px solid rgba(244, 185, 66, 0.4)',
            color: '#F4B942',
            padding: '8px 24px',
            borderRadius: '100px',
            fontSize: '16px',
            fontWeight: 800,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          COOKING MODE // HAKBANG 03 OF 04
        </div>
        <div
          style={{
            backgroundColor: 'rgba(234, 88, 12, 0.2)',
            border: '1px solid rgba(234, 88, 12, 0.5)',
            color: '#FB923C',
            padding: '8px 18px',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🔥</span>
          <span>LOW SIMMER</span>
        </div>
      </div>

      {/* Giant Radial Countdown Timer HUD */}
      <div
        style={{
          position: 'relative',
          width: 440,
          height: 440,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '36px',
          transform: `scale(${tickPulse})`,
        }}
      >
        {/* Glow backdrop behind timer */}
        <div
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(244, 185, 66, 0.25) 0%, rgba(8, 127, 140, 0.15) 60%, transparent 80%)',
            filter: 'blur(45px)',
          }}
        />

        {/* Circular SVG Ring */}
        <svg
          viewBox="0 0 400 400"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: 'rotate(-90deg)',
          }}
        >
          {/* Background Track */}
          <circle
            cx="200"
            cy="200"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="16"
            fill="none"
          />

          {/* Active Glowing Progress Ring */}
          <circle
            cx="200"
            cy="200"
            r={radius}
            stroke="url(#timerGrad)"
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            fill="none"
            style={{
              filter: 'drop-shadow(0 0 16px rgba(244, 185, 66, 0.8))',
            }}
          />

          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0CA6B7" />
              <stop offset="50%" stopColor="#F4B942" />
              <stop offset="100%" stopColor="#E25C3E" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Digital Stopwatch Display */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
          }}
        >
          <div
            style={{
              fontSize: '15px',
              fontFamily: 'monospace',
              letterSpacing: '4px',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            REMAINING TIME
          </div>

          <div
            style={{
              fontSize: '84px',
              fontWeight: 900,
              fontFamily: 'monospace, "SF Pro Display", sans-serif',
              letterSpacing: '-2px',
              color: '#FFFDF5',
              textShadow:
                '0 0 35px rgba(244, 185, 66, 0.7), 0 0 70px rgba(8, 127, 140, 0.4)',
              lineHeight: 1,
            }}
          >
            {timerString}
          </div>

          <div
            style={{
              marginTop: '10px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              color: '#0CA6B7',
              backgroundColor: 'rgba(8, 127, 140, 0.2)',
              padding: '4px 14px',
              borderRadius: '20px',
            }}
          >
            ● LIVE SINKRONISADO
          </div>
        </div>
      </div>

      {/* Active Step Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          background: 'rgba(12, 24, 30, 0.8)',
          border: '1.5px solid rgba(244, 185, 66, 0.35)',
          boxShadow:
            '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(244, 185, 66, 0.15)',
          borderRadius: 28,
          padding: '32px 36px',
          backdropFilter: 'blur(20px)',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '2.5px',
            color: '#F4B942',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          CURRENT STEP // KASALUKUYANG GAWAIN
        </div>
        <h4
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#FFFDF5',
            margin: '0 0 12px 0',
            lineHeight: 1.3,
          }}
        >
          “Takpan ang palayok. Pababain ang apoy at hayaang kumulo nang dahan-dahan hanggang lumambot ang manok.”
        </h4>
        <div
          style={{
            fontSize: '16px',
            color: 'rgba(255, 253, 245, 0.75)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>💡</span>
          <span>Tip: Don&apos;t stir vinegar right after pouring—let it boil first for a smoother taste.</span>
        </div>
      </div>

      {/* Segmented Step Capsules */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          width: '100%',
          maxWidth: 900,
        }}
      >
        {COOKING_STEPS.map((step, idx) => {
          const isDone = step.status === 'done';
          const isActive = step.status === 'active';

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                padding: '14px 10px',
                borderRadius: 16,
                backgroundColor: isActive
                  ? 'rgba(244, 185, 66, 0.2)'
                  : isDone
                  ? 'rgba(79, 138, 91, 0.18)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: isActive
                  ? '1.5px solid #F4B942'
                  : isDone
                  ? '1px solid #4F8A5B'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                boxShadow: isActive ? '0 0 20px rgba(244, 185, 66, 0.3)' : 'none',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: isActive ? '#F4B942' : isDone ? '#4F8A5B' : 'rgba(255, 255, 255, 0.4)',
                  marginBottom: '4px',
                }}
              >
                {isDone ? '✓ COMPLETED' : isActive ? '🔥 ACTIVE' : `STEP 0${idx + 1}`}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFDF5',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
