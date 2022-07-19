import * as React from 'react';
import Animated, {
  block,
  call,
  Clock,
  clockRunning,
  cond,
  Easing,
  EasingNode,
  interpolate as interpolateInternal,
  interpolateColors,
  interpolateNode,
  not,
  set,
  spring,
  startClock,
  stopClock,
  timing,
  Value,
  Extrapolate,
} from 'react-native-reanimated';
import { equal } from '@liuyunjs/utils/lib/equal';
import { useSafeCallback } from './useSafeCallback';
import { isColor, isTransform } from './utils';
import { keys } from './animations/utils';
import { AnimateStyle, KeyframesAnimate } from './types';

const interpolate = interpolateNode || interpolateInternal;

export function keyframes<T extends object>(Component: React.ComponentType<T>) {
  // @ts-ignore
  const AnimatedComponent = Animated.createAnimatedComponent(Component);
  const KeyframeMotion: React.FC<
    {
      children?: React.ReactNode;
      forwardRef?: React.Ref<any>;
      animate?: KeyframesAnimate;
      style?: any;
      onDidAnimate?: () => void;
      onWillAnimate?: () => void;
      type?: 'spring' | 'timing';
    } & Partial<Omit<Animated.SpringConfig, 'toValue'>> &
      Partial<Omit<Animated.TimingConfig, 'toValue'>>
  > = ({
    forwardRef: ref,
    animate,
    //@ts-ignore
    style: styleProp,
    onDidAnimate,
    onWillAnimate,
    type: typeProp,
    easing: easingProp,
    duration: durationProp,
    damping: dampingProp,
    restDisplacementThreshold: restDisplacementThresholdProp,
    restSpeedThreshold: restSpeedThresholdProp,
    overshootClamping: overshootClampingProp,
    mass: massProp,
    stiffness: stiffnessProp,
    ...restProps
  }) => {
    const safeOnWillAnimate = useSafeCallback(onWillAnimate);
    const prefRef = React.useRef<KeyframesAnimate>();
    const animStyleRef = React.useRef<any>({});
    const prevClockRef = React.useRef<Clock>();

    const updateStyle = (key: string, val: any) => {
      if (isTransform(key)) {
        if (!animStyleRef.current.transform) {
          animStyleRef.current.transform = [];
        }
        animStyleRef.current.transform.push({ [key]: val });
      } else {
        animStyleRef.current[key] = val;
      }
    };

    if (animate) {
      if (!equal(animate, prefRef.current)) {
        const position = new Value<number>(0);
        animStyleRef.current = {};

        const {
          style,
          overshootClamping = overshootClampingProp,
          restSpeedThreshold = restSpeedThresholdProp,
          restDisplacementThreshold = restDisplacementThresholdProp,
          damping = dampingProp,
          stiffness = stiffnessProp,
          mass = massProp,
          type = typeProp,
          duration = durationProp,
          easing = easingProp,
          ...rest
        } = animate;

        if (style) {
          keys(style).forEach((key) => updateStyle(key, style[key]));
        }

        const restKeys = keys(rest)
          .map((key) => {
            if (key === 'from') return 0;
            if (key === 'to') return 1;
            return +key;
          })
          .sort((a, b) => a - b);

        const ranges = {} as Record<
          keyof AnimateStyle,
          { input: number[]; output: (number | string)[] }
        >;

        restKeys.forEach((key) => {
          let item = rest[key];
          if (item == null) {
            if (key === 0) {
              item = rest.from!;
            } else if (key === 1) {
              item = rest.to!;
            }
          }
          if (!item) return;

          keys(item).forEach((itemKey) => {
            if (!ranges[itemKey]) {
              ranges[itemKey] = { input: [key], output: [item[itemKey]!] };
            } else {
              ranges[itemKey].input.push(key);
              ranges[itemKey].output.push(item[itemKey]!);
            }
          });
        });

        const rangeKeys = keys(ranges);
        const len = rangeKeys.length;

        rangeKeys.forEach((key, index) => {
          const { input, output } = ranges[key];
          console.log(key, input, output);
          if (input.length < 2) {
            throw new Error(`动画 ${key} 必须定义2帧及以上`);
          }
          const val = isColor(key)
            ? interpolateColors(position, {
                inputRange: input,
                outputColorRange: output,
              })
            : interpolate(position, {
                inputRange: input,
                outputRange: output,
                extrapolate: Extrapolate.CLAMP,
              });

          const defineAnimate = () => {
            const clock = new Clock();
            const frameTime = new Value<number>();
            const time = new Value<number>();
            const finished = new Value<number>();

            const node = block([
              prevClockRef.current ? stopClock(prevClockRef.current) : 0,
              cond(not(clockRunning(clock)), [
                set(frameTime, 0),
                set(time, 0),
                set(finished, 0),
              ]),
              type === 'spring'
                ? spring(
                    clock,
                    { finished, time, position, velocity: frameTime },
                    {
                      toValue: 1,
                      overshootClamping: overshootClamping!,
                      restSpeedThreshold: restSpeedThreshold!,
                      restDisplacementThreshold: restDisplacementThreshold!,
                      damping: damping!,
                      stiffness: stiffness!,
                      mass: mass!,
                    },
                  )
                : timing(
                    clock,
                    { finished, frameTime, time, position },
                    {
                      duration: duration!,
                      easing: easing!,
                      toValue: 1,
                    },
                  ),

              cond(not(clockRunning(clock)), startClock(clock)),

              cond(finished, [
                stopClock(clock),
                call([position], ([p]) => {
                  console.log('position', p);
                  onDidAnimate?.();
                }),
              ]),
              val,
            ]);

            prevClockRef.current = clock;

            return node;
          };

          updateStyle(key, index === len - 1 ? defineAnimate() : val);
        });

        safeOnWillAnimate();
        prefRef.current = animate;
      }
    }

    return (
      <AnimatedComponent
        {...(restProps as any)}
        ref={ref}
        style={[styleProp, animStyleRef.current]}
      />
    );
  };

  const E = EasingNode || Easing;

  KeyframeMotion.defaultProps = {
    easing: E.out(E.cubic),
    duration: 300,
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  };

  return KeyframeMotion;
}
