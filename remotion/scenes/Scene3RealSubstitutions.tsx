import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IPhoneFrame } from '../components/IPhoneFrame';

export const Scene3RealSubstitutions: React.FC = () => {
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

  // Servings count: increases from 4 to 6 around frame 40
  const servings = frame >= 45 ? 6 : 4;
  const budgetText = frame >= 45 ? '₱210–₱285' : '₱140–₱190';

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
          FLEXIBLE ADAPTATION
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
          I-adjust ang servings at pamalit.
        </h2>
        <p
          style={{
            fontSize: 22,
            color: 'rgba(255, 253, 245, 0.75)',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Auto-rescales costs & provides realistic sari-sari store substitutions.
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
                    Classic Chicken Adobo
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#B45309',
                    backgroundColor: '#FEF3C7',
                    padding: '4px 12px',
                    borderRadius: 100,
                  }}
                >
                  Pantry Grounded
                </span>
              </div>

              {/* Servings Scaler Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 22,
                  padding: '20px 22px',
                  boxShadow: '0 8px 25px rgba(24, 50, 58, 0.06)',
                  border: '1.5px solid rgba(8, 127, 140, 0.15)',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '1px',
                        color: '#087F8C',
                        textTransform: 'uppercase',
                      }}
                    >
                      MGA KAILANGAN
                    </div>
                    <div style={{ fontSize: 19, fontWeight: 800, color: '#18323A' }}>
                      Mga Sangkap
                    </div>
                  </div>

                  {/* Servings stepper */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      backgroundColor: '#F3F6F6',
                      padding: '6px 14px',
                      borderRadius: 100,
                      border: '1px solid #D5E4E6',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#087F8C',
                      }}
                    >
                      −
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: '#18323A',
                      }}
                    >
                      Servings {servings}
                    </span>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#087F8C',
                      }}
                    >
                      +
                    </span>
                  </div>
                </div>

                {/* Ingredients list with amounts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      padding: '5px 0',
                      borderBottom: '1px solid #F3F4F6',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#18323A' }}>
                      ✓ {servings === 6 ? '750g Manok' : '500g Manok'}
                    </span>
                    <span style={{ color: '#087F8C', fontWeight: 700 }}>
                      {servings === 6 ? '₱165' : '₱110'} (Meron ka na)
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      padding: '5px 0',
                      borderBottom: '1px solid #F3F4F6',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#18323A' }}>
                      ✓ {servings === 6 ? '3 pcs Patatas' : '2 pcs Patatas'}
                    </span>
                    <span style={{ color: '#087F8C', fontWeight: 700 }}>
                      {servings === 6 ? '₱38' : '₱25'} (Meron ka na)
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      padding: '5px 0',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#18323A' }}>
                      + {servings === 6 ? '1/3 cup Suka & Paminta' : '1/4 cup Suka & Paminta'}
                    </span>
                    <span style={{ color: '#C84B31', fontWeight: 700 }}>
                      {servings === 6 ? '₱18' : '₱12'} (Kulang pa)
                    </span>
                  </div>
                </div>

                {/* Budget check bar */}
                <div
                  style={{
                    marginTop: 12,
                    backgroundColor: '#FEF8EC',
                    borderRadius: 12,
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid #F8E2B5',
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '1px',
                      color: '#B45309',
                      textTransform: 'uppercase',
                    }}
                  >
                    ESTIMATED BUDGET
                  </span>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 900,
                      color: '#18323A',
                    }}
                  >
                    {budgetText}
                  </span>
                </div>
              </div>

              {/* Smart Substitutions Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 22,
                  padding: '20px 22px',
                  boxShadow: '0 8px 25px rgba(24, 50, 58, 0.06)',
                  border: '1.5px solid rgba(8, 127, 140, 0.15)',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '1px',
                    color: '#B45309',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  FLEXIBLE COOKING
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#18323A',
                    marginBottom: 12,
                  }}
                >
                  Mga Praktikal na Pamalit
                </div>

                {/* Sub 1 */}
                <div
                  style={{
                    backgroundColor: '#F4F9FA',
                    borderRadius: 14,
                    padding: '12px 14px',
                    border: '1px solid #D5E8EA',
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#087F8C', fontSize: 14, marginBottom: 2 }}>
                    Patatas ➔ Tokwa
                  </div>
                  <div style={{ color: '#5C6E74', fontSize: 13, lineHeight: 1.3 }}>
                    Mas matipid at mabisang sumisipsip sa sarsa ng adobo.
                  </div>
                </div>

                {/* Sub 2 */}
                <div
                  style={{
                    backgroundColor: '#F4F9FA',
                    borderRadius: 14,
                    padding: '12px 14px',
                    border: '1px solid #D5E8EA',
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#087F8C', fontSize: 14, marginBottom: 2 }}>
                    Suka ➔ Calamansi
                  </div>
                  <div style={{ color: '#5C6E74', fontSize: 13, lineHeight: 1.3 }}>
                    Mas presko at citrusy ang asim kaysa sa karaniwang sukang puti.
                  </div>
                </div>
              </div>

              {/* Pinoy Pantry Note */}
              <div
                style={{
                  backgroundColor: '#E8F5E9',
                  borderRadius: 14,
                  padding: '12px 16px',
                  border: '1px solid #C8E6C9',
                  fontSize: 13,
                  color: '#2E7D32',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>🇵🇭</span>
                <span>Base sa karaniwang sangkap sa sari-sari store o palengke.</span>
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                borderTop: '1px solid #E5E8EA',
                paddingTop: 14,
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #D5E4E6',
                  borderRadius: 14,
                  padding: '14px 20px',
                  fontSize: 18,
                  color: '#C84B31',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ♥
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#087F8C',
                  color: '#FFFDF5',
                  borderRadius: 14,
                  padding: '14px 20px',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: 16,
                  boxShadow: '0 6px 20px rgba(8, 127, 140, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span>Simulan ang Pagluluto</span>
                <span>➔</span>
              </div>
            </div>
          </div>
        </IPhoneFrame>
      </div>
    </div>
  );
};
