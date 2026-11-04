import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IPhoneFrame } from '../components/IPhoneFrame';

export const Scene2RealRecipes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 17, stiffness: 120, mass: 0.9 },
  });
  const enterX = interpolate(enterSpring, [0, 1], [800, 0]);

  // Outro transition
  const outroX = interpolate(frame, [110, 125], [0, -900], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroOpacity = interpolate(frame, [115, 125], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Card highlight interaction
  const cardScale = interpolate(frame, [30, 55], [1, 1.02], {
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
        padding: '0 40px',
        transform: `translateX(${enterX + outroX}px)`,
        opacity: outroOpacity,
        zIndex: 10,
      }}
    >
      {/* Editorial Title above phone */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 28,
          opacity: interpolate(frame, [0, 20], [0, 1]),
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
          GROUNDED AI DISCOVERY
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
          3 Praktikal na ulam sa bawat search.
        </h2>
        <p
          style={{
            fontSize: 22,
            color: 'rgba(255, 253, 245, 0.75)',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Honest pantry check: Meron Ka Na vs. Kulang Pa, may tantyang presyo.
        </p>
      </div>

      {/* Floating iPhone 16 Pro */}
      <div>
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
            {/* Top Area */}
            <div>
              {/* Header bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22, color: '#087F8C' }}>←</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#18323A' }}>
                    Mga Rekomendasyon
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#4F8A5B',
                    backgroundColor: '#E8F5E9',
                    padding: '4px 12px',
                    borderRadius: 100,
                  }}
                >
                  ✓ 3 Tugmang Ulam
                </span>
              </div>

              {/* Hero Match Card: Classic Chicken Adobo */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 22,
                  padding: '22px 24px',
                  boxShadow:
                    '0 10px 30px rgba(24, 50, 58, 0.08), 0 0 0 2px rgba(8, 127, 140, 0.25)',
                  border: '1px solid #C8E5E8',
                  marginBottom: 14,
                  transform: `scale(${cardScale})`,
                }}
              >
                {/* Badge & Heart */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      backgroundColor: '#E8F5F6',
                      color: '#087F8C',
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '1px',
                      padding: '5px 12px',
                      borderRadius: 100,
                      textTransform: 'uppercase',
                    }}
                  >
                    ★ CLASSIC ULAM
                  </span>
                  <span style={{ fontSize: 18, color: '#C84B31' }}>♥</span>
                </div>

                {/* Title & Description */}
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: '#18323A',
                    margin: '0 0 4px 0',
                  }}
                >
                  Classic Chicken Adobo
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: '#5C6E74',
                    margin: '0 0 14px 0',
                    lineHeight: 1.35,
                  }}
                >
                  Ginisang manok sa toyo, suka, at maraming piniritong bawang.
                </p>

                {/* Meta pills */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                  <span
                    style={{
                      backgroundColor: '#F3F6F6',
                      padding: '5px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#18323A',
                    }}
                  >
                    ⏱️ 35 min
                  </span>
                  <span
                    style={{
                      backgroundColor: '#F3F6F6',
                      padding: '5px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#18323A',
                    }}
                  >
                    Easy
                  </span>
                  <span
                    style={{
                      backgroundColor: '#E8F5F6',
                      padding: '5px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#087F8C',
                    }}
                  >
                    ₱140–₱190
                  </span>
                  <span
                    style={{
                      backgroundColor: '#F3F6F6',
                      padding: '5px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#18323A',
                    }}
                  >
                    4 serv.
                  </span>
                </div>

                {/* On Hand vs Missing */}
                <div style={{ borderTop: '1px solid #ECEEEF', paddingTop: 12 }}>
                  <div style={{ marginBottom: 8 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '1px',
                        color: '#4F8A5B',
                        marginBottom: 4,
                        textTransform: 'uppercase',
                      }}
                    >
                      MERON KA NA (4)
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {['Manok', 'Patatas', 'Bawang', 'Toyo'].map((ing) => (
                        <span
                          key={ing}
                          style={{
                            backgroundColor: '#E8F5E9',
                            color: '#2D6A4F',
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          ✓ {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '1px',
                        color: '#C84B31',
                        marginBottom: 4,
                        textTransform: 'uppercase',
                      }}
                    >
                      KULANG PA (2)
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['Suka', 'Paminta'].map((ing) => (
                        <span
                          key={ing}
                          style={{
                            backgroundColor: '#FDECE8',
                            color: '#C84B31',
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          + {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Chicken Afritada */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 18,
                  padding: '16px 20px',
                  border: '1px solid #ECEEEF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      backgroundColor: '#FDECE8',
                      color: '#C84B31',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 100,
                    }}
                  >
                    TOMATO STEW
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#087F8C' }}>
                    ₱150–₱210
                  </span>
                </div>
                <h4
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#18323A',
                    margin: '0 0 4px 0',
                  }}
                >
                  Chicken Afritada
                </h4>
                <p style={{ fontSize: 13, color: '#5C6E74', margin: 0 }}>
                  Malinamnam na nilagang manok at patatas sa sarsa ng kamatis.
                </p>
              </div>

              {/* Card 3: Bistek na Manok */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 18,
                  padding: '16px 20px',
                  border: '1px solid #ECEEEF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      backgroundColor: '#FEF8EC',
                      color: '#B45309',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 100,
                    }}
                  >
                    QUICK SAUTÉ
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#087F8C' }}>
                    ₱135–₱180
                  </span>
                </div>
                <h4
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#18323A',
                    margin: '0 0 4px 0',
                  }}
                >
                  Bistek na Manok
                </h4>
                <p style={{ fontSize: 13, color: '#5C6E74', margin: 0 }}>
                  Manok na ibinabad sa toyo at calamansi na may sibuyas rings.
                </p>
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
                <span style={{ fontSize: 20, color: '#94A3B8' }}>🏠</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>Kusina</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 20, color: '#087F8C' }}>📖</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#087F8C' }}>Mga Ulam</span>
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
