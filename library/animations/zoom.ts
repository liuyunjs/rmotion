import { KeyframesAnimate } from '../types';
import { keys, zoomEasing, extractTranslation } from './utils';
import { SlideType } from './slide';
import { Dimensions } from 'react-native';

export type ZoomType = SlideType | '';

const { width, height } = Dimensions.get('window');

const zoomTranslation = {
  Down: {
    translateY: 60,
  },
  Up: {
    translateY: -60,
  },
  Left: {
    translateX: 10,
  },
  Right: {
    translateX: -10,
  },
};

export const zoomIn = {
  from: {
    opacity: 0,
    scale: 0.3,
  },
  0.5: {
    opacity: 1,
  },
  to: {
    opacity: 1,
    scale: 1,
  },
};

export const zoomOut = {
  from: {
    opacity: 1,
    scale: 1,
  },
  0.5: {
    opacity: 1,
    scale: 0.3,
  },
  to: {
    opacity: 0,
    scale: 0,
  },
};

export const {
  zoomInDown,
  zoomOutDown,
  zoomOutRight,
  zoomInRight,
  zoomOutLeft,
  zoomInLeft,
  zoomOutUp,
  zoomInUp,
} = keys(zoomTranslation).reduce((previous, current) => {
  const [translationType, pivotPoint] = extractTranslation(
    zoomTranslation[current],
  );
  const modifier = Math.min(1, Math.max(-1, pivotPoint));
  previous[`zoomIn${current}`] = {
    easing: zoomEasing,
    0: {
      opacity: 0,
      scale: 0.1,
      [translationType]: modifier * -1000,
    },
    0.6: {
      opacity: 1,
      scale: 0.457,
      [translationType]: pivotPoint,
    },
    1: {
      scale: 1,
      [translationType]: 0,
    },
  };

  previous[`zoomOut${current}`] = {
    easing: zoomEasing,
    0: {
      opacity: 1,
      scale: 1,
      [translationType]: 0,
    },
    0.4: {
      opacity: 1,
      scale: 0.457,
      [translationType]: pivotPoint,
    },
    1: {
      opacity: 0,
      scale: 0.1,
      [translationType]: modifier * -1000,
    },
  };

  return previous;
}, {} as Record<`zoomIn${SlideType}` | `zoomOut${SlideType}`, KeyframesAnimate>);
