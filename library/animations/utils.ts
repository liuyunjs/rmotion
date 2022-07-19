// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Animated, { Easing, EasingNode } from 'react-native-reanimated';
const E = EasingNode || Easing;
export const easingIn = E.in(E.ease);
export const easingOut = E.in(E.ease);
export const zoomEasing = E.bezier(0.175, 0.885, 0.32, 1);

export const extractTranslation = (
  currentTranslation: { translateY: number } | { translateX: number },
) => {
  return 'translateX' in currentTranslation
    ? (['translateX', currentTranslation.translateX] as const)
    : (['translateY', currentTranslation.translateY] as const);
};

export const keys = <T extends object>(obj: T) =>
  Object.keys(obj) as unknown as (keyof T)[];
