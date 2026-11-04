import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IPhoneFrame } from '../components/IPhoneFrame';

export const Scene4RealCookingMode: React.FC = () => {
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

  // Countdown seconds
  const remainingSecs = Math.max(0, 300 - Math.floor(frame * 0.8));
  const mins = Math.floor(remainingSecs / 60);
  const secs = remainingSecs % 60;
  const timerStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

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
          GUIDED COOKING MODE
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
          Step-by-step habang nagluluto.
        </h2>
        <p
          style={{
            fontSize: 22,
            color: 'rgba(255, 253, 245, 0.75)',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Hands-free layout with stove heat level & built-in kitchen timer.
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
                  marginBottom: 18,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20, color: '#087F8C' }}>✕</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#18323A' }}>
                    Classic Chicken Adobo
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#C84B31',
                    backgroundColor: '#FDECE8',
                    padding: '4px 12px',
                    borderRadius: 100,
                  }}
                >
                  🔥 Active Stove
                </span>
              </div>

              {/* Cooking Mode Main Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  padding: '26px 24px',
                  boxShadow: '0 10px 35px rgba(24, 50, 58, 0.08)',
                  border: '1.5px solid rgba(8, 127, 140, 0.15)',
                  marginBottom: 16,
                }}
              >
                {/* Step counter & progress bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '1px',
                      color: '#087F8C',
                      textTransform: 'uppercase',
                    }}
                  >
                    HAKBANG 1 SA 3
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#087F8C' }}>
                    33%
                  </span>
                </div>

                {/* Progress track */}
                <div
                  style={{
                    width: '100%',
                    height: 6,
                    backgroundColor: '#E8F5F6',
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: '33%',
                      height: '100%',
                      backgroundColor: '#087F8C',
                      borderRadius: 10,
                    }}
                  />
                </div>

                {/* Step prompt */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '1px',
                    color: '#5C6E74',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  GAWIN ITO NGAYON
                </div>

                {/* Big step instruction */}
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: '#18323A',
                    lineHeight: 1.3,
                    margin: '0 0 18px 0',
                  }}
                >
                  Igisa ang bawang at sibuyas bago i-brown ang manok sa kawali.
                </h3>

                {/* Context badges: Heat & Time */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  <span
                    style={{
                      backgroundColor: '#FEF8EC',
                      border: '1px solid #F8E2B5',
                      color: '#B45309',
                      fontSize: 13,
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: 100,
                    }}
                  >
                    Katamtamang init: Medium 🔥
                  </span>
                  <span
                    style={{
                      backgroundColor: '#E8F5F6',
                      border: '1px solid #C8E5E8',
                      color: '#087F8C',
                      fontSize: 13,
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: 100,
                    }}
                  >
                    5 minuto ⏱️
                  </span>
                </div>

                {/* Interactive Built-in Timer Button */}
                <div
                  style={{
                    backgroundColor: '#F3F9FA',
                    border: '2px solid #087F8C',
                    borderRadius: 14,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    boxShadow: '0 4px 15px rgba(8, 127, 140, 0.12)',
                  }}
                >
                  <span style={{ fontSize: 18 }}>⏱️</span>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: '#087F8C',
                      fontFamily: 'monospace, sans-serif',
                    }}
                  >
                    Simulan ang timer: {timerStr}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      backgroundColor: '#087F8C',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}
                  >
                    RUNNING
                  </span>
                </div>
              </div>

              {/* Upcoming Steps Preview */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 20,
                  padding: '18px 22px',
                  border: '1px solid #ECEEEF',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '1px',
                    color: '#7B8E95',
                    marginBottom: 10,
                    textTransform: 'uppercase',
                  }}
                >
                  MGA SUSUNOD NA HAKBANG
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        backgroundColor: '#F3F4F6',
                        color: '#64748B',
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      2
                    </span>
                    <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.35 }}>
                      Ibuhos ang toyo at suka. Huwag munang haluin hanggang kumulo.
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        backgroundColor: '#F3F4F6',
                        color: '#64748B',
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      3
                    </span>
                    <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.35 }}>
                      Takpan at hayaang kumulo sa mahinang apoy nang 20 minuto.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: 12, paddingTop: 14, borderTop: '1px solid #E5E8EA' }}>
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D5E4E6',
                  color: '#5C6E74',
                  borderRadius: 14,
                  padding: '14px 18px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                ← Nakaraan
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#087F8C',
                  color: '#FFFDF5',
                  borderRadius: 14,
                  padding: '14px 18px',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: 15,
                  boxShadow: '0 6px 20px rgba(8, 127, 140, 0.3)',
                }}
              >
                Susunod ➔
              </div>
            </div>
          </div>
        </IPhoneFrame>
      </div>
    </div>
  );
};
