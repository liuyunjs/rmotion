import Animated from 'react-native-reanimated';
import {
  ImageStyle,
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
  StyleProp,
  TextStyle,
  TranslateXTransform,
  TranslateYTransform,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { BasisConf } from './BasisConf';
import { ColorConf } from './ColorConf';

export type SpringAnimConf = Partial<Omit<Animated.SpringConfig, 'toValue'>> & {
  type: 'spring';
};

export type TimingAnimConf = Partial<Omit<Animated.TimingConfig, 'toValue'>> & {
  type?: 'timing';
};

export type OneOfAnimConf = SpringAnimConf | TimingAnimConf;

export type AllAnimConf = SpringAnimConf & TimingAnimConf;

type AnimFrom<Style, T> = Partial<Record<keyof Style, T>>;

export type WithConf<T, C = OneOfAnimConf> = { value: T; config?: C };

type MaybeList<T> = T | T[];

type AnimAnimate<Anim> = {
  [K in keyof Anim]: MaybeList<Anim[K] | WithConf<Anim[K]>>;
};

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

export type AnimationConf = AnimAnimate<AnimFrom<ColorStyle, number | string>> &
  AnimAnimate<AnimFrom<TransStyle, number>> &
  AnimAnimate<AnimFrom<BasisStyle, number>> & { config?: OneOfAnimConf };

export type AnimationPresupposition = {
  from?: AnimFrom<ColorStyle, number | string> &
    AnimFrom<TransStyle, number> &
    AnimFrom<BasisStyle, number>;
  animate?: AnimationConf;
  exit?: AnimationConf;
};

export type AnimationProps = AnimationPresupposition & {
  config?: OneOfAnimConf;
  style?: StyleProp<ViewStyle & ImageStyle & TextStyle>;
  children?: React.ReactNode;
  motionRef?: React.Ref<ConfRef>;
  onDidAnimate?: (exit: boolean) => void;
  onWillAnimate?: (exit: boolean) => void;
};

export type ConfRef = Record<string, BasisConf | ColorConf>;

export interface AnimatePresenceProps {
  /**
   * By passing `initial={false}`, `AnimatePresence` will disable any initial animations on children
   * that are present when the component is first rendered.
   *
   * @library
   *
   * ```jsx
   * <AnimatePresence initial={false}>
   *   {isVisible && (
   *     <Frame
   *       key="modal"
   *       initial={{ opacity: 0 }}
   *       animate={{ opacity: 1 }}
   *       exit={{ opacity: 0 }}
   *     />
   *   )}
   * </AnimatePresence>
   * ```
   *
   * @motion
   *
   * ```jsx
   * <AnimatePresence initial={false}>
   *   {isVisible && (
   *     <motion.div
   *       key="modal"
   *       initial={{ opacity: 0 }}
   *       animate={{ opacity: 1 }}
   *       exit={{ opacity: 0 }}
   *     />
   *   )}
   * </AnimatePresence>
   * ```
   *
   * @public
   */
  initial?: boolean;
  /**
   * When a component is removed, there's no longer a chance to update its props. So if a component's `exit`
   * prop is defined as a dynamic variant and you want to pass a new `custom` prop, you can do so via `AnimatePresence`.
   * This will ensure all leaving components animate using the latest data.
   *
   * @public
   */
  custom?: any;
  /**
   * Fires when all exiting nodes have completed animating out.
   *
   * @public
   */
  onExitComplete?: () => void;
  /**
   * If set to `true`, `AnimatePresence` will only render one component at a time. The exiting component
   * will finished its exit animation before the entering component is rendered.
   *
   * @library
   *
   * ```jsx
   * function MyComponent({ currentItem }) {
   *   return (
   *     <AnimatePresence exitBeforeEnter>
   *       <Frame key={currentItem} exit={{ opacity: 0 }} />
   *     </AnimatePresence>
   *   )
   * }
   * ```
   *
   * @motion
   *
   * ```jsx
   * const MyComponent = ({ currentItem }) => (
   *   <AnimatePresence exitBeforeEnter>
   *     <motion.div key={currentItem} exit={{ opacity: 0 }} />
   *   </AnimatePresence>
   * )
   * ```
   *
   * @beta
   */
  exitBeforeEnter?: boolean;
  /**
   * Used in Framer to flag that sibling children *shouldn't* re-render as a result of a
   * child being removed.
   *
   * @internal
   */
  presenceAffectsLayout?: boolean;
}
