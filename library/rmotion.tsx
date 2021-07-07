import React from 'react';
import Animated from 'react-native-reanimated';
import { equal } from '@liuyunjs/utils/lib/equal';
import hoistNonReactStatics from 'hoist-non-react-statics';
// @ts-ignore
import { usePresence } from 'framer-motion/dist/es/components/AnimatePresence/use-presence';
import { BasisConf } from './BasisConf';
import { ColorConf } from './ColorConf';
import { ConfRef, AnimationProps, AnimationConf, WithConf } from './types';
import { isTransform, isColor } from './utils';

const { block, useCode, cond, call, Value, add, set, eq, onChange } = Animated;

export function rmotion<T>(Component: React.ComponentType<T>) {
  // @ts-ignore
  const AnimatedComponent = Animated.createAnimatedComponent(Component);
  const Motion = React.forwardRef<any, T & AnimationProps>(function Motion(
    {
      from,
      animate,
      exit,
      config,
      style,
      motionRef,
      onDidAnimate,
      onWillAnimate,
      ...rest
    },
    ref,
  ) {
    const confRef = React.useRef<ConfRef>();
    const prevRef = React.useRef<{ value: AnimationConf; dep: any }>();
    const animStyle = React.useRef<any>({}).current;
    const [isPresent, safeToUnmount] = usePresence();

    const hasExitStyle =
      !!exit && typeof exit === 'object' && !!Object.keys(exit).length;

    let conf = confRef.current;

    if (isPresent || !hasExitStyle) {
      if (
        !prevRef.current ||
        (animate && !equal(animate, prevRef.current.value, 4))
      ) {
        prevRef.current = { value: animate!, dep: [] };
        processor(animate!);
      }
    }

    React.useMemo(() => {
      if (!isPresent && hasExitStyle) {
        prevRef.current!.dep = [];
        processor(exit!);
      }
      //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPresent, hasExitStyle]);

    function createAndUpdateStyle(
      key: string,
      animValue: number | WithConf<number>,
    ) {
      conf![key] = isColor(key)
        ? new ColorConf(animValue)
        : new BasisConf(animValue);

      if (isTransform(key)) {
        if (!animStyle.transform) animStyle.transform = [];
        animStyle.transform.push({ [key]: conf![key].value });
      } else {
        animStyle[key] = conf![key].value;
      }
    }

    function processor(animConf: AnimationConf) {
      const currentAnim = animConf
        ? Array.isArray(animConf)
          ? animConf
          : [animConf]
        : [];
      if (!conf) {
        conf = confRef.current = {};
        if (from) currentAnim.unshift(from);
      } else {
        for (let key in conf) {
          if (!conf.hasOwnProperty(key)) continue;
          conf[key].clear();
        }
      }

      for (let i = 0, len = currentAnim.length; i < len; i++) {
        const { config: confItem, ...restAnim } = currentAnim[i];
        for (let key in restAnim) {
          if (!restAnim.hasOwnProperty(key)) continue;
          const animItem = restAnim[key];
          if (animItem == null) continue;
          if (!conf[key]) {
            if (Array.isArray(animItem)) {
              if (!animItem.length) continue;
              createAndUpdateStyle(key, animItem[0]);

              for (let k = 1, aLen = animItem.length; k < aLen; k++) {
                conf[key].add(animItem[k], confItem, config);
              }
            } else {
              createAndUpdateStyle(key, animItem);
            }
          } else {
            if (Array.isArray(animItem)) {
              for (let k = 0, aLen = animItem.length; k < aLen; k++) {
                conf[key].add(animItem[k], confItem, config);
              }
            } else {
              conf[key].add(animItem, confItem, config);
            }
          }
        }
      }
    }

    React.useEffect(
      function () {
        if (!isPresent && !hasExitStyle) {
          safeToUnmount?.();
        }
      },
      [hasExitStyle, isPresent, safeToUnmount],
    );

    React.useImperativeHandle(motionRef, () => conf!);

    useCode(() => {
      const nodes: Animated.Node<any>[] = [];

      for (let key in conf) {
        if (!conf.hasOwnProperty(key)) continue;
        const node = conf[key].start();
        if (node) nodes.push(node);
      }

      const len = nodes.length;
      if (!len) return;

      onWillAnimate?.(!isPresent);

      const total = new Value(0);

      return block([
        block(nodes.map((node) => onChange(node, set(total, add(total, 1))))),
        cond(
          eq(total, len),
          call([total], () => {
            if (!isPresent) safeToUnmount?.();
            onDidAnimate?.(!isPresent);
          }),
        ),
      ]);
    }, [prevRef.current!.dep]);

    return <AnimatedComponent {...rest} ref={ref} style={[style, animStyle]} />;
  });

  Motion.displayName = `rmotion(${
    Component.displayName || Component.name || 'Component'
  })`;

  return hoistNonReactStatics(Motion, Component);
}
