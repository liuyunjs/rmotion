import { AnimateStyle, KeyframesAnimate } from '../types';

const markFlipAnimation = (
  axis: 'X' | 'Y',
  reverse?: boolean,
): KeyframesAnimate => {
  const rotateKey = `rotate${axis}` as const;

  const initialValues: Partial<AnimateStyle> = {
    opacity: 0,
    [rotateKey]: '90deg',
  };

  const targetValues: Partial<AnimateStyle> = {
    opacity: 1,
    [rotateKey]: '0deg',
  };

  const animation = {
    style: {
      perspective: 500,
    },
    0: initialValues,
    1: targetValues,
  };

  if (reverse) {
    const from = animation[0];
    animation[0] = animation[1];
    animation[1] = from;
  }

  return animation;
};

export const { flipInX, flipInY, flipOutX, flipOutY } = (
  ['X', 'Y'] as const
).reduce((previousValue, currentValue) => {
  previousValue[`flipIn${currentValue}`] = markFlipAnimation(currentValue);
  previousValue[`flipOut${currentValue}`] = markFlipAnimation(
    currentValue,
    true,
  );

  return previousValue;
}, {} as Record<`flip${'Out' | 'In'}${'X' | 'Y'}`, KeyframesAnimate>);
