import { Dimensions } from 'react-native';
import { KeyframesAnimate } from '../types';
import { keys, extractTranslation } from './utils';

export type SlideType = 'Down' | 'Up' | 'Left' | 'Right';

const { width, height } = Dimensions.get('window');

const slideTranslation = {
  Down: {
    translateY: height,
  },
  Up: {
    translateY: -height,
  },
  Left: {
    translateX: -width,
  },
  Right: {
    translateX: width,
  },
};

export const {
  slideInDown,
  slideInLeft,
  slideInRight,
  slideInUp,
  slideOutDown,
  slideOutLeft,
  slideOutUp,
  slideOutRight,
} = keys(slideTranslation).reduce((previousValue, currentValue) => {
  const [translationType, value] = extractTranslation(
    slideTranslation[currentValue],
  );
  previousValue[`slideIn${currentValue}`] = {
    from: {
      [translationType]: value,
    },
    to: {
      [translationType]: 0,
    },
  };
  previousValue[`slideOut${currentValue}`] = {
    from: {
      [translationType]: 0,
    },
    to: {
      [translationType]: value,
    },
  };
  return previousValue;
}, {} as Record<`slideIn${SlideType}` | `slideOut${SlideType}`, KeyframesAnimate>);
