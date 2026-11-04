import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Scene1WebIntro } from './web_scenes/Scene1WebIntro';
import { Scene2WebDeck } from './web_scenes/Scene2WebDeck';
import { Scene3WebSplit } from './web_scenes/Scene3WebSplit';
import { Scene4WebBento } from './web_scenes/Scene4WebBento';
import { Scene5WebOutro } from './web_scenes/Scene5WebOutro';

export const HapagWebShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: '#F5F2EA',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Soundtrack matching Skillora's clean, upbeat, human rhythm */}
      <Audio src={staticFile('skillora-audio.aac')} volume={0.9} />

      {/* Scene 1: Kusina Intro (0 to 75 = 2.5s) */}
      <Sequence from={0} durationInFrames={75}>
        <Scene1WebIntro globalFrame={currentFrame} />
      </Sequence>

      {/* Scene 2: Pick an ulam fanned deck (75 to 165 = 3.0s, total 90 frames) */}
      <Sequence from={75} durationInFrames={90}>
        <Scene2WebDeck globalFrame={currentFrame} />
      </Sequence>

      {/* Scene 3: Your recipe path split screen (165 to 270 = 3.5s, total 105 frames) */}
      <Sequence from={165} durationInFrames={105}>
        <Scene3WebSplit globalFrame={currentFrame} />
      </Sequence>

      {/* Scene 4: Built for every kusina bento grid (270 to 375 = 3.5s, total 105 frames) */}
      <Sequence from={270} durationInFrames={105}>
        <Scene4WebBento globalFrame={currentFrame} />
      </Sequence>

      {/* Scene 5: Sunburst Grand Finale outro (375 to 450 = 2.5s, total 75 frames) */}
      <Sequence from={375} durationInFrames={75}>
        <Scene5WebOutro globalFrame={currentFrame} />
      </Sequence>
    </div>
  );
};
