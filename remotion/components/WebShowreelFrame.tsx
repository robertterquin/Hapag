import React from 'react';
import { useCurrentFrame } from 'remotion';

interface WebShowreelFrameProps {
  sceneNumber: string;
  sceneTitle: string;
  theme?: 'light' | 'dark' | 'terracotta' | 'split';
  globalFrame?: number;
}

export const WebShowreelFrame: React.FC<WebShowreelFrameProps> = ({
  sceneNumber,
  sceneTitle,
  theme = 'light',
  globalFrame,
}) => {
  const localFrame = useCurrentFrame();
  const frame = globalFrame !== undefined ? globalFrame : localFrame;

  // Timecode calculation: 00:00:SS:FF
  const totalSeconds = Math.floor(frame / 30);
  const framesMod = frame % 30;
  const timecode = `00:00:${String(totalSeconds).padStart(2, '0')}:${String(framesMod).padStart(2, '0')}`;

  const leftTextColor =
    theme === 'dark' || theme === 'terracotta' || theme === 'split'
      ? 'rgba(255, 255, 255, 0.85)'
      : 'rgba(24, 50, 58, 0.75)';

  const rightTextColor =
    theme === 'dark'
      ? 'rgba(255, 255, 255, 0.85)'
      : theme === 'terracotta'
      ? 'rgba(255, 255, 255, 0.85)'
      : 'rgba(24, 50, 58, 0.75)';

  const accentColor =
    theme === 'terracotta'
      ? '#FFFDF5'
      : theme === 'dark'
      ? '#0CA6B7'
      : '#C84B31';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '36px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 50,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: leftTextColor,
          }}
        >
          <span style={{ fontSize: 16 }}>┌</span>
          <span>HAPAG — SHOWREEL &apos;26</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: rightTextColor,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: accentColor,
            }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: 14 }}>{timecode}</span>
          <span style={{ fontSize: 16 }}>┐</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: leftTextColor,
          }}
        >
          <span style={{ fontSize: 16 }}>└</span>
          <span>
            {sceneNumber} — {sceneTitle}
          </span>
        </div>

        {/* Timeline Scrubber Ticks matching Skillora */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: rightTextColor,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '3px',
              fontFamily: 'monospace',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span>+----+----+----+----+</span>
          </div>
          <span style={{ fontSize: 16 }}>┘</span>
        </div>
      </div>
    </div>
  );
};
