import React from 'react';

export const PaperBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F5F2EA',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Subtle Dot Matrix Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(24, 50, 58, 0.08) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          opacity: 0.85,
        }}
      />

      {/* Gentle Warm Paper Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, transparent 50%, rgba(220, 214, 200, 0.45) 100%)',
        }}
      />
    </div>
  );
};
