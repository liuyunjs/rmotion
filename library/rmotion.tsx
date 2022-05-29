import * as React from 'react';
import Animated, {
  block,
  useCode,
  cond,
  call,
  Value,
  add,
  set,
  eq,
  onChange,
} from 'react-native-reanimated';
import { equal } from '@liuyunjs/utils/lib/equal';
import { isAnyObject } from '@liuyunjs/utils/lib/isAnyObject';
import hoistNonReactStatics from 'hoist-non-react-statics';
// @ts-ignore
// import { usePresence } from 'framer-motion/dist/es/components/AnimatePresence/use-presence';
import { usePresence } from 'framer-motion';
import { BasisConf } from './BasisConf';
import { ColorConf } from './ColorConf';
import { ConfRef, RMotionProps, WithConf } from './types';
import { isTransform, isColor, maybeToArr } from './utils';

export function rmotion<T extends object>(Component: React.ComponentType<T>) {
  // @ts-ignore
  const AnimatedComponent = Animated.createAnimatedComponent(Component);

  const Motion = React.forwardRef<any, Animated.AnimateProps<T> & RMotionProps>(
    function Motion(
      {
        from,
        animate,
        exit,
        config,
        //@ts-ignore
        style,
        motionRef,
        onDidAnimate,
        onWillAnimate,
        ...rest
      },
      ref,
    ) {
      const confRef = React.useRef<ConfRef>();
      const prevRef = React.useRef<{ value: any; dep: any }>();
      const animStyle = React.useRef<any>({}).current;
      const [isPresent, safeToUnmount] = usePresence();

      const hasExitStyle =
        !!exit && isAnyObject(exit) && !!Object.keys(exit).length;

      let conf = confRef.current!;
      if (isPresent || !hasExitStyle) {
        if (
          !prevRef.current ||
          (animate && !equal(animate, prevRef.current.value))
        ) {
          prevRef.current = { value: animate!, dep: [] };
          processor(animate);
        }
      } else {
        prevRef.current!.dep = [];
        processor(exit);
      }

      function createAndUpdateStyle(key: string, animValue: WithConf<number>) {
        conf[key] = isColor(key)
          ? new ColorConf(animValue)
          : new BasisConf(animValue);

        if (isTransform(key)) {
          if (!animStyle.transform) animStyle.transform = [];
          animStyle.transform.push({ [key]: conf![key].value });
        } else {
          animStyle[key] = conf![key].value;
        }
      }

      function processor(animConf: any) {
        animConf = JSON.parse(JSON.stringify(animConf));
        if (!conf) {
          conf = confRef.current = {};
          if (from) {
            Object.keys(from).forEach((key) => {
              if (animConf[key]) {
                animConf[key] = maybeToArr(animConf[key]);
                animConf[key].unshift((from as any)[key]);
              } else {
                animConf[key] = (from as any)[key];
              }
            });
          }
        } else {
          Object.keys(conf).forEach((key) => {
            conf[key].clear();
          });
        }

        Object.keys(animConf).forEach((key) => {
          const current = maybeToArr(animConf[key]);
          let i = 0;
          if (!conf[key]) {
            createAndUpdateStyle(key, current[0]);
            i++;
          }
          for (let aLen = current.length; i < aLen; i++) {
            conf[key].add(current[i], config);
          }
        });
      }

      React.useEffect(
        function () {
          if (!isPresent && !hasExitStyle) {
            safeToUnmount?.();
          }
        },
        [hasExitStyle, isPresent, safeToUnmount],
      );

      React.useImperativeHandle(motionRef, () => confRef.current!, []);

      useCode(() => {
        const nodes: Animated.Node<any>[] = [];

        Object.keys(conf!).forEach((key) => {
          const node = conf![key].start();
          if (node) nodes.push(node);
        });

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

      return (
        <AnimatedComponent
          {...(rest as any)}
          ref={ref}
          style={[style, animStyle]}
        />
      );
    },
  );

  Motion.displayName = `rmotion(${
    Component.displayName || Component.name || 'Component'
  })`;

  return hoistNonReactStatics(Motion, Component);
}
