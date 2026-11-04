import React from 'react';
import { Composition } from 'remotion';
import { HapagWebShowcase } from './HapagWebShowcase';
import { HapagShowcase } from './HapagShowcase';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HapagWebShowcase"
        component={HapagWebShowcase}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="HapagShowcase"
        component={HapagShowcase}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
