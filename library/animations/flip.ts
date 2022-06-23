import { Easing, EasingNode } from 'react-native-reanimated';
import { AnimationConf } from '../types';
import { defineTimingAnimate, radian, easingIn } from './utils';

export type FlipType = 'X' | 'Y';

const markFlipInAnimation = (type: FlipType): AnimationConf => {
  return {
    perspective: [400, 400],
    opacity: defineTimingAnimate([0, [1, 0.6]], easingIn),
    [`rotate${type}`]: defineTimingAnimate(
      [
        radian(90),
        [radian(-20), 0.4],
        [radian(10), 0.2],
        [radian(-5), 0.2],
        [radian(0), 0.2],
      ],
      easingIn,
    ),
  };
};

const markFlipOutAnimation = (type: FlipType): AnimationConf => {
  return {
    perspective: [400, 400],
    opacity: defineTimingAnimate([1, [1, 0.3], [0, 0.7]]),
    [`rotate${type}`]: defineTimingAnimate([
      radian(0),
      [radian(-20), 0.3],
      [radian(90), 0.7],
    ]),
  };
};

export const { flipXIn, flipXOut, flipYOut, flipYIn } = (
  ['X', 'Y'] as const
).reduce((previousValue, currentValue) => {
  previousValue[`flip${currentValue}In`] = markFlipInAnimation(currentValue);
  previousValue[`flip${currentValue}Out`] = markFlipOutAnimation(currentValue);
  return previousValue;
}, {} as Record<`flip${FlipType}In` | `flip${FlipType}Out`, AnimationConf>);
