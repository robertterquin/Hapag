import React from 'react';
import { Composition } from 'remotion';
import { HapagShowcase } from './HapagShowcase';

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
