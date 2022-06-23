import { AnimationConf } from '../types';
import { defineTimingAnimate, injectTranslateInternal, keys } from './utils';
import { ZoomType } from './zoom';

export type BounceType = ZoomType;

const translationInDuration = [0, 0.6, 0.15, 0.15, 0.1];
const translationOutDuration = [0.2, 0.2, 0.05, 0.55];

const bounceTranslationDirection = {
  Up: {
    translateY: -1,
  },
  Down: {
    translateY: 1,
  },
  Left: {
    translateX: -1,
  },
  Right: {
    translateX: 1,
  },
};

 const markBounceInAnimation = (type: BounceType): AnimationConf => {
  const animate: AnimationConf = {
    opacity: defineTimingAnimate([0, [1, 0.6]]),
  };

  if (!type) {
    animate.scale = defineTimingAnimate([
      0.3,
      [1.1, 0.2],
      [0.9, 0.2],
      [1.03, 0.2],
      [0.97, 0.2],
      [1, 0.2],
    ]);
    return animate;
  }

  return injectTranslateInternal(
    animate,
    bounceTranslationDirection[type],
    (direction) => {
      return defineTimingAnimate(
        [800, -25, 10, -5, 0].map((item, index) => {
          if (type === 'Left' || type === 'Right') {
            item = item * 0.8;
          }
          return [item * direction, translationInDuration[index]];
        }),
      );
    },
  );
};

 const markBounceOutAnimation = (type: BounceType): AnimationConf => {
  const animate: AnimationConf = {
    opacity: defineTimingAnimate([1, [1, 0.55], [0, 0.45]]),
  };

  if (!type) {
    animate.scale = defineTimingAnimate([
      1,
      [0.9, 0.2],
      [1.11, 0.3],
      [1.11, 0.05],
      [0.3, 0.45],
    ]);
    return animate;
  }

  return injectTranslateInternal(
    animate,
    bounceTranslationDirection[type],
    (direction) => {
      const translation =
        type === 'Left' || type === 'Right'
          ? [0, 10, -20, -20, 600]
          : [0, 10, -20, -20, 800];

      return defineTimingAnimate(
        translation.reverse().map((item, index) => {
          return [item * direction, translationOutDuration[index]];
        }),
      );
    },
  );
};

const bounceKeys: BounceType[] = keys(bounceTranslationDirection);
bounceKeys.push('');

export const {
  bounceDownIn,
  bounceDownOut,
  bounceOut,
  bounceLeftOut,
  bounceRightOut,
  bounceRightIn,
  bounceLeftIn,
  bounceUpOut,
  bounceIn,
  bounceUpIn,
} = bounceKeys.reduce((previousValue, currentValue) => {
  previousValue[`bounce${currentValue}In`] =
    markBounceInAnimation(currentValue);
  previousValue[`bounce${currentValue}Out`] =
    markBounceOutAnimation(currentValue);
  return previousValue;
}, {} as Record<`bounce${BounceType}In` | `bounce${BounceType}Out`, AnimationConf>);
