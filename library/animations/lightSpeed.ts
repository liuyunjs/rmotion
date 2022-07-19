// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Animated from 'react-native-reanimated';
import { easingIn, easingOut } from './utils';

export const lightSpeedInRight = {
  easing: easingOut,
  0: {
    opacity: 0,
    translateX: 200,
    skewX: '-30deg',
  },
  0.6: {
    opacity: 1,
    translateX: 0,
    skewX: '-20deg',
  },
  0.8: {
    skewX: '-5deg',
  },
  1: {
    opacity: 1,
    translateX: 0,
    skewX: '0deg',
  },
};

export const lightSpeedInLeft = {
  easing: easingOut,
  0: {
    opacity: 0,
    translateX: -200,
    skewX: '30deg',
  },
  0.6: {
    opacity: 1,
    translateX: 0,
    skewX: '20deg',
  },
  0.8: {
    skewX: '5deg',
  },
  1: {
    opacity: 1,
    translateX: 0,
    skewX: '0deg',
  },
};

export const lightSpeedOutRight = {
  easing: easingIn,
  0: {
    opacity: 1,
    translateX: 0,
    skewX: '0deg',
  },
  1: {
    opacity: 0,
    translateX: 200,
    skewX: '-30deg',
  },
};

export const lightSpeedOutLeft = {
  easing: easingIn,
  0: {
    opacity: 1,
    translateX: 0,
    skewX: '0deg',
  },
  1: {
    opacity: 0,
    translateX: -200,
    skewX: '30deg',
  },
};
