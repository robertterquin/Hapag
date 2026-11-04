import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IPhoneFrame } from '../components/IPhoneFrame';

export const Scene1RealInput: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110, mass: 0.9 },
  });

  // Outro transition
  const outroX = interpolate(frame, [110, 125], [0, -900], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroOpacity = interpolate(frame, [115, 125], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dynamic typing simulation
  const fullText = '1/2 kg manok, patatas, bawang, toyo...';
  const charsTyped = Math.floor(
    interpolate(frame, [15, 65], [0, fullText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const typedText = fullText.slice(0, charsTyped);

  // Ingredient pills popping in sequentially
  const showPill1 = frame >= 28;
  const showPill2 = frame >= 42;
  const showPill3 = frame >= 54;
  const showPill4 = frame >= 66;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        transform: `translateX(${outroX}px)`,
        opacity: outroOpacity,
        zIndex: 10,
      }}
    >
      {/* Editorial Headline above phone */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 28,
          opacity: interpolate(frame, [5, 25], [0, 1]),
          transform: `translateY(${interpolate(frame, [5, 25], [20, 0])}px)`,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '2.5px',
            color: '#F4B942',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          SMART INGREDIENT MATCHING
        </span>
        <h2
          style={{
            fontSize: 50,
            fontWeight: 800,
            color: '#FFFDF5',
            margin: '0 0 8px 0',
            letterSpacing: '-1px',
            lineHeight: 1.15,
          }}
        >
          Ano’ng nasa kusina mo?
        </h2>
        <p
          style={{
            fontSize: 22,
            color: 'rgba(255, 253, 245, 0.75)',
            margin: 0,
            fontWeight: 400,
          }}
        >
          I-type lang ang meron ka. Agad hahanap si Hapag ng lutong bahay.
        </p>
      </div>

      {/* Floating iPhone 16 Pro */}
      <div
        style={{
          transform: `scale(${enterSpring}) translateY(${interpolate(
            enterSpring,
            [0, 1],
            [60, 0]
          )}px)`,
        }}
      >
        <IPhoneFrame width={680} height={1360}>
          <div
            style={{
              padding: '20px 28px 16px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              backgroundColor: '#FAF8F5',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
            }}
          >
            {/* Top area */}
            <div>
              {/* App Nav Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 26 }}>🍲</span>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: '#18323A',
                      letterSpacing: '-0.5px',
                    }}
                  >
                    Hapag
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#087F8C',
                    backgroundColor: 'rgba(8, 127, 140, 0.1)',
                    padding: '4px 12px',
                    borderRadius: 100,
                  }}
                >
                  150 Filipino Dishes
                </span>
              </div>

              {/* Hero Prompt */}
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '1.5px',
                    color: '#087F8C',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  SMART INGREDIENT INPUT
                </span>
                <h3
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: '#18323A',
                    margin: '0 0 6px 0',
                    lineHeight: 1.2,
                  }}
                >
                  I-type ang mga sangkap sa iyong kusina.
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: '#5C6E74',
                    margin: 0,
                    lineHeight: 1.35,
                  }}
                >
                  Tagalog, English, o Taglish — agad kinikilala at tinatantya ni Hapag.
                </p>
              </div>

              {/* Input Card Container */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 22,
                  padding: 22,
                  boxShadow: '0 8px 25px rgba(24, 50, 58, 0.06)',
                  border: '1.5px solid rgba(8, 127, 140, 0.15)',
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '1px',
                    color: '#087F8C',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}
                >
                  MAGDAGDAG NG SANGKAP
                </div>

                {/* Search Field with live cursor & typing */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F3F6F6',
                    borderRadius: 14,
                    padding: '14px 16px',
                    border: '2px solid #087F8C',
                    marginBottom: 16,
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 16, color: '#087F8C' }}>🔍</span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#18323A',
                      flex: 1,
                    }}
                  >
                    {typedText}
                    <span
                      style={{
                        display: 'inline-block',
                        width: 2,
                        height: 16,
                        backgroundColor: '#087F8C',
                        marginLeft: 2,
                        verticalAlign: 'middle',
                        opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
                      }}
                    />
                  </span>
                </div>

                {/* Recognized Ingredients Pills */}
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#7B8E95',
                      marginBottom: 8,
                      textTransform: 'uppercase',
                    }}
                  >
                    MGA NAKILALANG SANGKAP
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {showPill1 && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          backgroundColor: '#E8F5F6',
                          border: '1px solid #B5E0E4',
                          color: '#087F8C',
                          padding: '8px 14px',
                          borderRadius: 100,
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        <span>🍗</span>
                        <span>500g Manok</span>
                        <span style={{ fontSize: 11, opacity: 0.6 }}>✕</span>
                      </div>
                    )}

                    {showPill2 && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          backgroundColor: '#E8F5F6',
                          border: '1px solid #B5E0E4',
                          color: '#087F8C',
                          padding: '8px 14px',
                          borderRadius: 100,
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        <span>🥔</span>
                        <span>2 Patatas</span>
                        <span style={{ fontSize: 11, opacity: 0.6 }}>✕</span>
                      </div>
                    )}

                    {showPill3 && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          backgroundColor: '#E8F5F6',
                          border: '1px solid #B5E0E4',
                          color: '#087F8C',
                          padding: '8px 14px',
                          borderRadius: 100,
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        <span>🧄</span>
                        <span>Bawang</span>
                        <span style={{ fontSize: 11, opacity: 0.6 }}>✕</span>
                      </div>
                    )}

                    {showPill4 && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          backgroundColor: '#E8F5F6',
                          border: '1px solid #B5E0E4',
                          color: '#087F8C',
                          padding: '8px 14px',
                          borderRadius: 100,
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        <span>🍶</span>
                        <span>Toyo</span>
                        <span style={{ fontSize: 11, opacity: 0.6 }}>✕</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferences Strip */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <span
                    style={{
                      backgroundColor: '#FEF8EC',
                      border: '1px solid #F8E2B5',
                      color: '#B45309',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: 100,
                    }}
                  >
                    4 Servings
                  </span>
                  <span
                    style={{
                      backgroundColor: '#FEF8EC',
                      border: '1px solid #F8E2B5',
                      color: '#B45309',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: 100,
                    }}
                  >
                    ₱140–₱200
                  </span>
                  <span
                    style={{
                      backgroundColor: '#FEF8EC',
                      border: '1px solid #F8E2B5',
                      color: '#B45309',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: 100,
                    }}
                  >
                    Mild Spice
                  </span>
                </div>
              </div>

              {/* Big Action Button */}
              <div
                style={{
                  backgroundColor: '#087F8C',
                  color: '#FFFDF5',
                  borderRadius: 16,
                  padding: '16px 20px',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: 17,
                  letterSpacing: '0.5px',
                  boxShadow: '0 6px 20px rgba(8, 127, 140, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <span>Maghanap ng Ulam</span>
                <span>➔</span>
              </div>

              {/* Common Kusina Staples suggestions */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 18,
                  padding: '16px 20px',
                  border: '1px solid #ECEEEF',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#7B8E95',
                    marginBottom: 10,
                    textTransform: 'uppercase',
                  }}
                >
                  PALAGIANG NASA KUSINA (TAP TO ADD)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['🧅 Sibuyas', '🧂 Asin', '🌿 Suka', '🍳 Mantika', '🌶️ Siling Haba'].map(
                    (item) => (
                      <span
                        key={item}
                        style={{
                          backgroundColor: '#F3F6F6',
                          color: '#4A5B61',
                          padding: '6px 12px',
                          borderRadius: 100,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        + {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Bottom iOS Tab Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                borderTop: '1px solid #E5E8EA',
                paddingTop: 12,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 20, color: '#087F8C' }}>🏠</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#087F8C' }}>Kusina</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 20, color: '#94A3B8' }}>📖</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>Mga Ulam</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 20, color: '#94A3B8' }}>♥</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>Paborito</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 20, color: '#94A3B8' }}>👤</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>Account</span>
              </div>
            </div>
          </div>
        </IPhoneFrame>
      </div>
    </div>
  );
};
