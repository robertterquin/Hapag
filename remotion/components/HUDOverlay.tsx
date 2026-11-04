import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface HUDOverlayProps {
  currentSceneTitle?: string;
  subline?: string;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  currentSceneTitle = 'KUSINA ENGINE',
  subline = '14.5995° N, 120.9842° E // MANILA',
}) => {
  const frame = useCurrentFrame();

  // Subtle blinking indicator
  const blink = Math.floor(frame / 12) % 2 === 0;

  // Running frame counter formatted as 4 digits
  const framePadded = String(frame).padStart(4, '0');

  // Simulated telemetry signal strength
  const signalWidth = interpolate(Math.sin(frame * 0.2), [-1, 1], [30, 75]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '50px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 50,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", Roboto, sans-serif',
        color: 'rgba(255, 255, 255, 0.65)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontSize: '14px',
      }}
    >
      {/* Top HUD Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: blink ? '#22C55E' : 'rgba(34, 197, 94, 0.3)',
              boxShadow: blink ? '0 0 10px #22C55E' : 'none',
            }}
          />
          <span style={{ fontWeight: 700, color: '#FFFDF5', letterSpacing: '3px' }}>
            HAPAG // OS
          </span>
          <span
            style={{
              backgroundColor: 'rgba(8, 127, 140, 0.25)',
              border: '1px solid rgba(12, 166, 183, 0.4)',
              color: '#0CA6B7',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            SYS_ONLINE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>SIGNAL</span>
            <div
              style={{
                width: 80,
                height: 4,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${signalWidth}%`,
                  height: '100%',
                  backgroundColor: '#087F8C',
                  boxShadow: '0 0 6px #087F8C',
                }}
              />
            </div>
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#F4B942' }}>
            FRM:{framePadded}
          </span>
        </div>
      </div>

      {/* Subtle Corner Reticles */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 50,
          width: 20,
          height: 20,
          borderTop: '2px solid rgba(255, 255, 255, 0.3)',
          borderLeft: '2px solid rgba(255, 255, 255, 0.3)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 90,
          right: 50,
          width: 20,
          height: 20,
          borderTop: '2px solid rgba(255, 255, 255, 0.3)',
          borderRight: '2px solid rgba(255, 255, 255, 0.3)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          left: 50,
          width: 20,
          height: 20,
          borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
          borderLeft: '2px solid rgba(255, 255, 255, 0.3)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          right: 50,
          width: 20,
          height: 20,
          borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
          borderRight: '2px solid rgba(255, 255, 255, 0.3)',
        }}
      />

      {/* Bottom HUD Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '20px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '4px',
              letterSpacing: '2px',
            }}
          >
            ACTIVE MODULE
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFDF5',
              letterSpacing: '1.5px',
            }}
          >
            {currentSceneTitle}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '4px',
              letterSpacing: '2px',
            }}
          >
            LOCATION / TELEMETRY
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              color: 'rgba(244, 185, 66, 0.9)',
            }}
          >
            {subline}
          </div>
        </div>
      </div>
    </div>
  );
};
