import * as React from 'react';
import Animated, {
  block,
  cond,
  call,
  Value,
  add,
  set,
  eq,
  onChange,
  Node,
} from 'react-native-reanimated';
import { equal } from '@liuyunjs/utils/lib/equal';
import { isAnyObject } from '@liuyunjs/utils/lib/isAnyObject';
import { useConst } from '@liuyunjs/hooks/lib/useConst';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { usePresence } from 'framer-motion';
import { BasisConf } from './BasisConf';
import { ColorConf } from './ColorConf';
import {
  ConfRef,
  RMotionProps,
  AnimationConf,
  RMotionInternalProps,
} from './types';
import { isTransform, isColor, maybeToArr } from './utils';

export function rmotion<T extends object>(Component: React.ComponentType<T>) {
  // @ts-ignore
  const AnimatedComponent = Animated.createAnimatedComponent(Component);

  const RMotionInternal: React.FC<RMotionInternalProps> = ({
    forwardRef,
    from,
    animate,
    config,
    //@ts-ignore
    style,
    onDidAnimate,
    onWillAnimate,
    ...rest
  }) => {
    const constant = useConst<{
      animateNodes: ConfRef;
      prevAnimate: AnimationConf;
      animStyle: any;
      //  @ts-ignore
    }>({
      animStyle: {},
    });
    let { animStyle, animateNodes, prevAnimate } = constant;

    if (animate) {
      // 上次的 animate 跟本次的 animate 不一样需要触发动画
      if (!equal(animate, prevAnimate)) {
        // 保存本次动画配置，留给下次比对
        constant.prevAnimate = animate!;

        // 深拷贝一下，保证后面的操作不会修改到原始的 animate
        const animateCopy = JSON.parse(JSON.stringify(animate!));
        // animateNodes 为 undefined 的时候，说明是首次加载动画
        if (!animateNodes) {
          animateNodes = constant.animateNodes = {};
          // 首次加载动画需要考虑到 from，后续就不管 from
          if (from) {
            Object.keys(from).forEach((key) => {
              /**
               * 将 from 里面的动画配置拷贝到我们深拷贝的 animate 上去，使 animate 里面的动画配置变成一个数组, 内容如下所示
               * {
               *   opacity: [0, 0,5, {value: 1}],
               * }
               */
              if (animateCopy[key] != null) {
                animateCopy[key] = maybeToArr(animateCopy[key]);
                animateCopy[key].unshift((from as any)[key]);
              } else {
                animateCopy[key] = (from as any)[key];
              }
            });
          }
        } else {
          // 不是首次加载动画，把之前的动画节点全部清空
          Object.keys(animateNodes).forEach((key) => {
            animateNodes[key].clear();
          });
        }

        Object.keys(animateCopy).forEach((key) => {
          const current = maybeToArr(animateCopy[key]);
          let i = 0;
          // 如果是一个全新的动画节点，需要初始化一个对应的 Conf
          if (!animateNodes[key]) {
            // 如果是颜色值动画，需要一个特殊处理
            animateNodes[key] = isColor(key)
              ? new ColorConf(current[0])
              : new BasisConf(current[0]);
            i++;
          }
          for (let aLen = current.length; i < aLen; i++) {
            animateNodes[key].add(current[i], config);
          }
        });

        updateAnimateStyle();
      }
    } else {
      // 这一步是为了组件初始化的时候如果没有传 animate，也要赋值 animateNodes，animateNodes 赋值了代表组件不是初始化了
      // 这样会忽略初始化是没传 animate 但是传了 from 的情况
      constant.animateNodes = constant.animateNodes || {};
    }

    function updateAnimateStyle() {
      const items = Object.keys(animateNodes).reduce(
        (previousValue, currentValue) => {
          const node = animateNodes[currentValue].start();
          if (node instanceof Node) {
            previousValue.push([currentValue, node]);
          }
          return previousValue;
        },
        [] as [string, Animated.Node<any>][],
      );

      const len = items.length;

      if (len) {
        const total = new Value(0);

        onWillAnimate();

        items.forEach(([key, node], index) => {
          const val = block([
            onChange(node, set(total, add(total, 1))),
            index === len - 1
              ? onChange(
                  total,
                  cond(eq(total, len), call([total], onDidAnimate)),
                )
              : 0,
            animateNodes[key].value,
          ]);
          if (isTransform(key)) {
            if (!animStyle.transform) {
              animStyle.transform = [];
            }
            // transform 是一个数组，所以查找一下是否之前存在一个一样的，比如 translateX
            const prevTransform = animStyle.transform.find(
              (item: any) => item[key],
            );
            if (prevTransform) {
              prevTransform[key] = val;
            } else {
              animStyle.transform.push({ [key]: val });
            }
          } else {
            animStyle[key] = val;
          }
        });
      }
    }

    return (
      <AnimatedComponent
        {...(rest as any)}
        ref={forwardRef}
        style={[style, animStyle]}
      />
    );
  };

  const Motion = React.forwardRef<any, Animated.AnimateProps<T> & RMotionProps>(
    function Motion(
      { animate, exit, onDidAnimate, onWillAnimate, ...rest },
      ref,
    ) {
      const [isPresent, safeToUnmount] = usePresence();

      const hasExitStyle =
        !!exit && isAnyObject(exit) && !!Object.keys(exit).length;

      React.useLayoutEffect(
        function () {
          if (!isPresent && !hasExitStyle) {
            safeToUnmount();
          }
        },
        [hasExitStyle, isPresent, safeToUnmount],
      );

      return (
        <RMotionInternal
          {...rest}
          onDidAnimate={() => {
            onDidAnimate?.(!isPresent);
            if (!isPresent) {
              safeToUnmount();
            }
          }}
          onWillAnimate={() => {
            onWillAnimate?.(!isPresent);
          }}
          animate={isPresent ? animate : exit}
          forwardRef={ref}
        />
      );
    },
  );

  Motion.displayName = `rmotion(RMotion${
    Component.displayName || Component.name || 'Component'
  })`;

  return hoistNonReactStatics(Motion, Component);
}
