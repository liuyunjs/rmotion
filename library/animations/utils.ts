import Animated, { Easing, EasingNode } from 'react-native-reanimated';
import { isNumber } from '@liuyunjs/utils/lib/isNumber';
import { AnimationConf, TimingAnimConf, WithConf } from '../types';

const E = EasingNode || Easing;
export const easingIn = E.in(E.ease);
export const easingOut = E.in(E.ease);
export const zoomEasing =  E.bezier(0.175, 0.885, 0.32, 1);

export const radian = <T = number>(deg: T): T => {
  //  @ts-ignore
  return Math.PI * (parseFloat(deg) / 180);
};

export const adjustTranslate = (
  translation: { translateY: number } | { translateX: number },
  callback: (
    translate: number,
  ) => number | number[] | WithConf<number> | WithConf<number>[],
) => {
  if ('translateX' in translation) {
    return { translateX: callback(translation.translateX) };
  }
  return { translateY: callback(translation.translateY) };
};

export const injectTranslateInternal = (
  animate: AnimationConf,
  translation: { translateY: number } | { translateX: number },
  callback: (
    translate: number,
  ) => number | number[] | WithConf<number> | WithConf<number>[],
) => Object.assign(animate, adjustTranslate(translation, callback));

export const injectTranslate = (
  animate: AnimationConf,
  translation: { translateY: number } | { translateX: number },
  reverse?: boolean,
) =>
  injectTranslateInternal(animate, translation, (translate) => {
    return reverse ? [0, translate] : [translate, 0];
  });

const defineTimingAnimateItem = <T = number>(
  value: T,
  duration: number,
  easing?: (t: Animated.Adaptable<number>) => Animated.Node<number>,
) => {
  const item: WithConf<T, TimingAnimConf> = {
    value,
    config: { duration },
  };
  if (easing) {
    item.config!.easing = easing;
  }
  return item;
};

export const defineTimingAnimate = (
  items: ([number, number] | number)[],
  easing?: (t: Animated.Adaptable<number>) => Animated.Node<number>,
) => {
  return items.map((item) => {
    if (isNumber(item)) {
      return item as number;
    }
    return defineTimingAnimateItem(item[0], item[1]!, easing);
  });
};

export const keys = <T extends object>(obj: T) =>
  Object.keys(obj) as unknown as (keyof T)[];
