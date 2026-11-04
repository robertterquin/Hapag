import React from 'react';
import { Audio, interpolate, Sequence, staticFile } from 'remotion';
import { CleanBackground } from './components/CleanBackground';
import { Scene1RealInput } from './scenes/Scene1RealInput';
import { Scene2RealRecipes } from './scenes/Scene2RealRecipes';
import { Scene3RealSubstitutions } from './scenes/Scene3RealSubstitutions';
import { Scene4RealCookingMode } from './scenes/Scene4RealCookingMode';
import { Scene5HumanOutro } from './scenes/Scene5HumanOutro';

export const HapagShowcase: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1920,
        backgroundColor: '#0F1518',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
      }}
    >
      {/* Warm, wholesome acoustic guitar soundtrack (Jason Shaw, CC BY 3.0) */}
      <Audio
        src={staticFile('acoustic-cooking.aac')}
        volume={(f) =>
          interpolate(f, [0, 25, 595, 630], [0, 0.9, 0.9, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      {/* Clean, warm studio lighting backdrop */}
      <CleanBackground />

      {/* 5 Real Product Sequences */}
      {/* Scene 1: Smart Ingredient Input inside real iPhone (0.0s – 4.2s) */}
      <Sequence from={0} durationInFrames={125}>
        <Scene1RealInput />
      </Sequence>

      {/* Scene 2: Grounded Recipe Discovery with Meron vs Kulang (4.2s – 8.3s) */}
      <Sequence from={125} durationInFrames={125}>
        <Scene2RealRecipes />
      </Sequence>

      {/* Scene 3: Scaler & Smart Sari-Sari Store Substitutions (8.3s – 12.5s) */}
      <Sequence from={250} durationInFrames={125}>
        <Scene3RealSubstitutions />
      </Sequence>

      {/* Scene 4: Step-by-Step Cooking Mode with Live Timer (12.5s – 16.7s) */}
      <Sequence from={375} durationInFrames={125}>
        <Scene4RealCookingMode />
      </Sequence>

      {/* Scene 5: Chef Kalabaw ("Kain na!") & Clean App Outro (16.7s – 21.0s) */}
      <Sequence from={500} durationInFrames={130}>
        <Scene5HumanOutro />
      </Sequence>
    </div>
  );
};
