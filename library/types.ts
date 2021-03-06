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
import { BasisConf } from './BasisConf';
import { ColorConf } from './ColorConf';

export type SpringAnimConf = Partial<
  Override<Omit<Animated.TimingConfig, 'toValue'>, undefined>
> &
  Partial<Omit<Animated.SpringConfig, 'toValue'>> & {
    type: 'spring';
  };

export type TimingAnimConf = Partial<
  Override<Omit<Animated.SpringConfig, 'toValue'>, undefined>
> &
  Partial<Omit<Animated.TimingConfig, 'toValue'>> & {
    type?: 'timing';
  };

export type OneOfAnimConf = SpringAnimConf | TimingAnimConf;

type Override<Style, T> = {
  [P in keyof Style]: T;
};

export type TransStyle = ScaleTransform &
  ScaleXTransform &
  ScaleYTransform &
  TranslateXTransform &
  TranslateYTransform &
  PerpectiveTransform &
  Override<
    RotateTransform &
      RotateXTransform &
      RotateYTransform &
      RotateZTransform &
      SkewXTransform &
      SkewYTransform,
    number | string
  >;

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

type Animate<Style> = {
  [P in keyof Style]?: MaybeList<WithConf<Style[P]>>;
};

export type WithConf<T, C = OneOfAnimConf> = T | { value: T; config?: C };

export type MaybeList<T> = T | T[];

export type AnimateStyle = ColorStyle & TransStyle & BasisStyle;
export type AnimationConf = Animate<AnimateStyle>;

export type KeyframesAnimate = {
  [key: number]: Partial<AnimateStyle>;
  from?: Partial<AnimateStyle>;
  to?: Partial<AnimateStyle>;
  style?: Partial<AnimateStyle>;
} & OneOfAnimConf;

export type RMotionInternalProps = OneOfAnimConf & {
  children?: React.ReactNode;
  onDidAnimate: () => void;
  onWillAnimate: () => void;
  forwardRef?: React.Ref<any>;
  combineAnimate?: boolean;
  animate?: AnimationConf;
};

export type RMotionProps = Omit<
  RMotionInternalProps,
  'onDidAnimate' | 'onWillAnimate' | 'forwardRef' | 'animate'
> & {
  onDidAnimate?: (exit: boolean) => void;
  onWillAnimate?: (exit: boolean) => void;
} & (
    | {
        exit?: AnimationConf;
        animate?: AnimationConf;
        from?: undefined;
        keyframes?: false;
      }
    | {
        keyframes?: false;
        from: Partial<AnimateStyle>;
        animate?: Partial<AnimateStyle>;
        exit?: Partial<AnimateStyle>;
      }
    | {
        from?: undefined;
        animate?: KeyframesAnimate;
        exit?: KeyframesAnimate;
        keyframes: true;
      }
  );

export type AnimationProps = RMotionProps;

export type ConfRef = Record<string, BasisConf | ColorConf>;
