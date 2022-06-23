import { AnimationConf } from '../types';
import { keys, injectTranslate } from './utils';
import { ZoomType } from './zoom';

export type FadeType = ZoomType | 'DownBig' | 'UpBig' | 'LeftBig' | 'RightBig';

const fadeTranslation = {
  Down: {
    translateY: 100,
  },
  Up: {
    translateY: -100,
  },
  Left: {
    translateX: 100,
  },
  Right: {
    translateX: -100,
  },
  DownBig: {
    translateY: 500,
  },
  UpBig: {
    translateY: -500,
  },
  LeftBig: {
    translateX: 500,
  },
  RightBig: {
    translateX: -500,
  },
};

const markFadeInAnimation = (type: FadeType): AnimationConf => {
  const animate: AnimationConf = { opacity: [0, 1] };
  return type ? injectTranslate(animate, fadeTranslation[type]) : animate;
};

 const markFadeOutAnimation = (type: FadeType): AnimationConf => {
  const animate: AnimationConf = { opacity: [1, 0] };
  return type ? injectTranslate(animate, fadeTranslation[type], true) : animate;
};

const fadeTypes: FadeType[] = keys(fadeTranslation);
fadeTypes.push('');

export const {
  fadeIn,
  fadeOut,
  fadeDownOut,
  fadeDownBigOut,
  fadeDownBigIn,
  fadeLeftOut,
  fadeLeftBigIn,
  fadeLeftBigOut,
  fadeDownIn,
  fadeRightBigOut,
  fadeRightIn,
  fadeRightOut,
  fadeRightBigIn,
  fadeLeftIn,
  fadeUpBigOut,
  fadeUpBigIn,
  fadeUpOut,
  fadeUpIn,
} = fadeTypes.reduce((previous, current) => {
  previous[`fade${current}In`] = markFadeInAnimation(current);
  previous[`fade${current}Out`] = markFadeOutAnimation(current);
  return previous;
}, {} as Record<`fade${FadeType}In` | `fade${FadeType}Out`, AnimationConf>);
