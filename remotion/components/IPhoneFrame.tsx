import React from 'react';

interface IPhoneFrameProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  darkStatus?: boolean;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  children,
  width = 720,
  height = 1460,
  darkStatus = false,
}) => {
  const statusColor = darkStatus ? '#18323A' : '#18323A';

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 68,
        padding: 16,
        background: 'linear-gradient(145deg, #2D3339 0%, #15181B 50%, #252A2E 100%)',
        boxShadow:
          '0 50px 140px -20px rgba(0, 0, 0, 0.85), 0 25px 60px -10px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Side buttons for realism */}
      {/* Volume Up */}
      <div
        style={{
          position: 'absolute',
          left: -4,
          top: 260,
          width: 4,
          height: 64,
          backgroundColor: '#353C42',
          borderRadius: '4px 0 0 4px',
        }}
      />
      {/* Volume Down */}
      <div
        style={{
          position: 'absolute',
          left: -4,
          top: 340,
          width: 4,
          height: 64,
          backgroundColor: '#353C42',
          borderRadius: '4px 0 0 4px',
        }}
      />
      {/* Power Button */}
      <div
        style={{
          position: 'absolute',
          right: -4,
          top: 290,
          width: 4,
          height: 90,
          backgroundColor: '#353C42',
          borderRadius: '0 4px 4px 0',
        }}
      />

      {/* Inner Screen Display */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 54,
          backgroundColor: '#FAF8F5',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* iOS Status Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 54,
            padding: '0 36px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 40,
            color: statusColor,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {/* Time */}
          <span>9:41</span>

          {/* Dynamic Island */}
          <div
            style={{
              position: 'absolute',
              top: 13,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 150,
              height: 34,
              backgroundColor: '#000000',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 14,
            }}
          >
            {/* Front Camera Dot */}
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: '#111827',
                border: '1.5px solid #1E293B',
              }}
            />
          </div>

          {/* Battery & Signal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13 }}>
            <span>5G</span>
            <div
              style={{
                width: 24,
                height: 12,
                borderRadius: 4,
                border: `1.5px solid ${statusColor}`,
                padding: 1.5,
                display: 'flex',
              }}
            >
              <div
                style={{
                  width: '80%',
                  height: '100%',
                  backgroundColor: statusColor,
                  borderRadius: 1.5,
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Viewport */}
        <div
          style={{
            width: '100%',
            height: '100%',
            paddingTop: 54,
            paddingBottom: 28,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 160,
            height: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            borderRadius: 10,
            zIndex: 50,
          }}
        />

        {/* Glass Screen Reflection Glare */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 40%)',
            pointerEvents: 'none',
            zIndex: 45,
          }}
        />
      </div>
    </div>
  );
};
