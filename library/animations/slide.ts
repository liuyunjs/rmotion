import { Dimensions } from 'react-native';
import { AnimationConf } from '../types';
import { keys, injectTranslate } from './utils';

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
    translateX: width,
  },
  Right: {
    translateX: -width,
  },
};

export const {
  slideDownIn,
  slideDownOut,
  slideLeftOut,
  slideLeftIn,
  slideRightOut,
  slideRightIn,
  slideUpOut,
  slideUpIn,
} = keys(slideTranslation).reduce((previousValue, currentValue) => {
  previousValue[`slide${currentValue}In`] = injectTranslate(
    {},
    slideTranslation[currentValue],
  );
  previousValue[`slide${currentValue}Out`] = injectTranslate(
    {},
    slideTranslation[currentValue],
    true,
  );
  return previousValue;
}, {} as Record<`slide${SlideType}In` | `slide${SlideType}Out`, AnimationConf>);
