import { AnimationConf } from '../types';
import { defineTimingAnimate, radian, easingIn, easingOut } from './utils';

export const lightSpeedIn: AnimationConf = {
  opacity: defineTimingAnimate([0, [1, 0.6]], easingOut),
  translateX: defineTimingAnimate([200, [0, 0.6]], easingOut),
  skewX: defineTimingAnimate(
    [radian(30), [radian(20), 0.6], [radian(-5), 0.2], [radian(0), 0.2]],
    easingOut,
  ),
};

export const lightSpeedOut: AnimationConf = {
  opacity: defineTimingAnimate([1, [0, 1]], easingIn),
  translateX: defineTimingAnimate([0, [200, 1]], easingIn),
  skewX: defineTimingAnimate([radian(0), [radian(30), 1]], easingIn),
};
