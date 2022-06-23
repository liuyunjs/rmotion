import { AnimationConf } from '../types';
import { defineTimingAnimate, keys, injectTranslateInternal, zoomEasing } from './utils';
import { SlideType } from './slide';


export type ZoomType = SlideType | '';

const zoomTranslation = {
  Down: {
    translateY: -60,
  },
  Up: {
    translateY: 60,
  },
  Left: {
    translateX: 10,
  },
  Right: {
    translateX: -10,
  },
};



export const zoomIn = {
  opacity: defineTimingAnimate([0, [1, 0.5]]),
  scale: [0.3, 1],
};

export const zoomOut = {
  opacity: defineTimingAnimate([1, [1, 0.5], [0, 0.5]]),
  scale: defineTimingAnimate([1, [0.3, 0.5], [0, 0.5]]),
};

export const {
  zoomDownIn,
  zoomDownOut,
  zoomLeftOut,
  zoomRightOut,
  zoomRightIn,
  zoomLeftIn,
  zoomUpOut,
  zoomUpIn,
} = keys(zoomTranslation).reduce((previous, current) => {
  previous[`zoom${current}In`] = injectTranslateInternal(
    {
      scale: defineTimingAnimate([0.1, [0.457, 0.6], [1, 0.4]], zoomEasing),
      opacity: defineTimingAnimate([0, [1, 0.6]], zoomEasing),
    },
    zoomTranslation[current],
    (pivotPoint) => {
      const modifier = Math.min(1, Math.max(-1, pivotPoint));
      return defineTimingAnimate(
        [modifier * -1000, [pivotPoint, 0.6], [0, 0.4]],
        zoomEasing,
      );
    },
  );

  previous[`zoom${current}Out`] = injectTranslateInternal(
    {
      scale: defineTimingAnimate([1, [0.457, 0.4], [0, 0.6]], zoomEasing),
      opacity: defineTimingAnimate([1, [1, 0.4], [0, 0.6]], zoomEasing),
    },
    zoomTranslation[current],
    (pivotPoint) => {
      const modifier = Math.min(1, Math.max(-1, pivotPoint));
      return defineTimingAnimate(
        [0, [pivotPoint, 0.4], [modifier * -1000, 0.6]],
        zoomEasing,
      );
    },
  );
  return previous;
}, {} as Record<`zoom${SlideType}In` | `zoom${SlideType}Out`, AnimationConf>);
