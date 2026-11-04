import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Background } from './components/Background';
import { HUDOverlay } from './components/HUDOverlay';
import { Scene1NeonPalayok } from './scenes/Scene1NeonPalayok';
import { Scene2KineticPantry } from './scenes/Scene2KineticPantry';
import { Scene3CinematicCard } from './scenes/Scene3CinematicCard';
import { Scene4DigitalTimer } from './scenes/Scene4DigitalTimer';
import { Scene5TriumphLutoNa } from './scenes/Scene5TriumphLutoNa';
import { Scene6GrandReveal } from './scenes/Scene6GrandReveal';

export const HapagShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // Dynamic HUD module title based on frame range
  let activeModule = 'GENESIS // PALAYOK CORE';
  let hudGlowColor = '#087F8C';

  if (frame >= 105 && frame < 210) {
    activeModule = 'PANTRY RESOLVER // INPUT MATRIX';
    hudGlowColor = '#F4B942';
  } else if (frame >= 210 && frame < 315) {
    activeModule = 'RECIPE INTEL // ADOBONG MANOK';
    hudGlowColor = '#4F8A5B';
  } else if (frame >= 315 && frame < 435) {
    activeModule = 'COOKING HUD // HAKBANG RUNTIME';
    hudGlowColor = '#F4B942';
  } else if (frame >= 435 && frame < 525) {
    activeModule = 'SARAP CONFIRMED // CHEF KALABAW';
    hudGlowColor = '#E25C3E';
  } else if (frame >= 525) {
    activeModule = 'PRODUCTION DEPLOY // HAPAG OS';
    hudGlowColor = '#087F8C';
  }

  // Camera impact micro-shake on beat drops
  let shakeX = 0;
  let shakeY = 0;
  if ((frame >= 105 && frame <= 112) || (frame >= 435 && frame <= 442)) {
    const shakeIntensity = 6 * (1 - (frame % 8) / 8);
    shakeX = Math.sin(frame * 3.5) * shakeIntensity;
    shakeY = Math.cos(frame * 4.2) * shakeIntensity;
  }

  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1920,
        backgroundColor: '#070D10',
        overflow: 'hidden',
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
      }}
    >
      {/* Energetic Electronic Audio Track */}
      <Audio src={staticFile('audio.aac')} />

      {/* Cybernetic Ambient Space Backdrop */}
      <Background glowColor={hudGlowColor} />

      {/* HUD Telemetry & Corner Brackets */}
      <HUDOverlay
        currentSceneTitle={activeModule}
        subline="14.5995° N, 120.9842° E // MANILA HQ"
      />

      {/* 6 Timed Sequences synced to the beat */}
      {/* Scene 1: Neon Palayok Wireframe Reveal (0.0s – 3.5s) */}
      <Sequence from={0} durationInFrames={105}>
        <Scene1NeonPalayok />
      </Sequence>

      {/* Scene 2: Kinetic Typography & 3D Pantry Shelf (3.5s – 7.0s) */}
      <Sequence from={105} durationInFrames={105}>
        <Scene2KineticPantry />
      </Sequence>

      {/* Scene 3: 3D Recipe Card Perspective Tilt (7.0s – 10.5s) */}
      <Sequence from={210} durationInFrames={105}>
        <Scene3CinematicCard />
      </Sequence>

      {/* Scene 4: Digital Timer & Hakbang Cooking Mode (10.5s – 14.5s) */}
      <Sequence from={315} durationInFrames={120}>
        <Scene4DigitalTimer />
      </Sequence>

      {/* Scene 5: Luto Na! & Chef Kalabaw Mascot (14.5s – 17.5s) */}
      <Sequence from={435} durationInFrames={90}>
        <Scene5TriumphLutoNa />
      </Sequence>

      {/* Scene 6: Grand Reveal & CTA (17.5s – 21.0s) */}
      <Sequence from={525} durationInFrames={105}>
        <Scene6GrandReveal />
      </Sequence>
    </div>
  );
};
