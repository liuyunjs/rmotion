import { KeyframesAnimate } from '../types';
import { keys, extractTranslation } from './utils';
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
    translateX: -100,
  },
  Right: {
    translateX: 100,
  },
  DownBig: {
    translateY: 500,
  },
  UpBig: {
    translateY: -500,
  },
  LeftBig: {
    translateX: -500,
  },
  RightBig: {
    translateX: 500,
  },
};

const markFadeAnimation = (
  type: FadeType,
  reverse?: boolean,
): KeyframesAnimate => {
  const animate: KeyframesAnimate = {
    0: {
      opacity: 0,
    },
    1: {
      opacity: 1,
    },
  };
  if (type) {
    const [translationType, value] = extractTranslation(fadeTranslation[type]);
    animate[0]![translationType] = value;
    animate[1]![translationType] = 0;
  }

  if (reverse) {
    const from = animate[0];
    animate[0] = animate[1];
    animate[1] = from;
  }
  return animate;
};

const fadeTypes: FadeType[] = keys(fadeTranslation);
fadeTypes.push('');

export const {
  fadeIn,
  fadeOut,
  fadeOutRight,
  fadeInRight,
  fadeInLeft,
  fadeOutDown,
  fadeOutLeft,
  fadeInDown,
  fadeOutUp,
  fadeInUp,
  fadeOutDownBig,
  fadeOutLeftBig,
  fadeOutUpBig,
  fadeInUpBig,
  fadeOutRightBig,
  fadeInRightBig,
  fadeInLeftBig,
  fadeInDownBig,
} = fadeTypes.reduce((previous, current) => {
  previous[`fadeIn${current}`] = markFadeAnimation(current);
  previous[`fadeOut${current}`] = markFadeAnimation(current, true);
  return previous;
}, {} as Record<`fadeIn${FadeType}` | `fadeOut${FadeType}`, KeyframesAnimate>);
