import Animated from 'react-native-reanimated';
import {
  PerpectiveTransform,
  RotateTransform,
  RotateXTransform,
  RotateYTransform,
  RotateZTransform,
  ScaleTransform,
  ScaleXTransform,
  ScaleYTransform,
  SkewXTransform,
  SkewYTransform,
  TranslateXTransform,
  TranslateYTransform,
} from 'react-native';
import * as React from 'react';
import type { AnimatePresenceProps } from 'framer-motion';
import { BasisConf } from './BasisConf';
import { ColorConf } from './ColorConf';

export type SpringAnimConf = Partial<Omit<Animated.SpringConfig, 'toValue'>> & {
  type: 'spring';
};

export type TimingAnimConf = Partial<Omit<Animated.TimingConfig, 'toValue'>> & {
  type?: 'timing';
};

export type OneOfAnimConf = SpringAnimConf | TimingAnimConf;

export type TransStyle = PerpectiveTransform &
  RotateTransform &
  RotateXTransform &
  RotateYTransform &
  RotateZTransform &
  ScaleTransform &
  ScaleXTransform &
  ScaleYTransform &
  TranslateXTransform &
  TranslateYTransform &
  SkewXTransform &
  SkewYTransform;

export type ColorStyle = {
  color: number | string;
  backgroundColor: number | string;
  borderBottomColor: number | string;
  borderColor: number | string;
  borderEndColor: number | string;
  borderLeftColor: number | string;
  borderRightColor: number | string;
  borderStartColor: number | string;
  borderTopColor: number | string;
  shadowColor: number | string;
  overlayColor: number | string;
  tintColor: number | string;
  textShadowColor: number | string;
  textDecorationColor: number | string;
};

type BasisStyle = {
  borderBottomEndRadius: number;
  borderBottomLeftRadius: number;
  borderBottomRightRadius: number;
  borderBottomStartRadius: number;
  borderBottomWidth: number;
  borderLeftWidth: number;
  borderRadius: number;
  borderRightWidth: number;
  borderTopEndRadius: number;
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderTopStartRadius: number;
  borderTopWidth: number;
  borderWidth: number;
  opacity: number;
  elevation: number;
  shadowOpacity: number;
  shadowRadius: number;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  textShadowRadius: number;
  width: number;
  height: number;

  left: number;
  margin: number;
  marginBottom: number;
  marginEnd: number;
  marginHorizontal: number;
  marginLeft: number;
  marginRight: number;
  marginStart: number;
  marginTop: number;
  marginVertical: number;
  maxHeight: number;
  maxWidth: number;
  minHeight: number;
  minWidth: number;
  padding: number;
  paddingBottom: number;
  paddingEnd: number;
  paddingHorizontal: number;
  paddingLeft: number;
  paddingRight: number;
  paddingStart: number;
  paddingTop: number;
  paddingVertical: number;
  right: number;
  start: number;
  top: number;
  end: number;
  bottom: number;
  borderEndWidth: number;
  borderStartWidth: number;
};

type From<Style, T> = Partial<Record<keyof Style, T>>;

type Animate<Style, T> = Partial<Record<keyof Style, MaybeList<WithConf<T>>>>;

export type WithConf<T, C = OneOfAnimConf> = T | { value: T; config?: C };

type MaybeList<T> = T | T[];

export type AnimationConf = Animate<ColorStyle, number | string> &
  Animate<TransStyle, number> &
  Animate<BasisStyle, number>;

export type RMotionProps = {
  from?: From<ColorStyle, number | string> &
    From<TransStyle, number> &
    From<BasisStyle, number>;
  animate?: AnimationConf;
  exit?: AnimationConf;
  config?: OneOfAnimConf;
  children?: React.ReactNode;
  motionRef?: React.Ref<ConfRef>;
  onDidAnimate?: (exit: boolean) => void;
  onWillAnimate?: (exit: boolean) => void;
};

export type AnimationProps = RMotionProps;

export type ConfRef = Record<string, BasisConf | ColorConf>;
export type { AnimatePresenceProps };
