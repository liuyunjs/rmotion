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
  Easing,
  EasingNode,
} from 'react-native-reanimated';
import { equal } from '@liuyunjs/utils/lib/equal';
import { isAnyObject } from '@liuyunjs/utils/lib/isAnyObject';
import { useConst } from '@liuyunjs/hooks/lib/useConst';
import { useWillMount } from '@liuyunjs/hooks/lib/useWillMount';
import { BasisConf } from './BasisConf';
import { ColorConf } from './ColorConf';
import {
  ConfRef,
  AnimationConf,
  RMotionInternalProps,
  WithConf,
  AnimateStyle,
} from './types';
import { isTransform, isColor, toArray } from './utils';
import { keys } from './animations/utils';
import { useSafeCallback } from './useSafeCallback';

const copy = <T extends object>(data: T): T => JSON.parse(JSON.stringify(data));

export function sequence<T extends object>(Component: React.ComponentType<T>) {
  // @ts-ignore
  const AnimatedComponent = Animated.createAnimatedComponent(Component);

  const SequenceMotionInternal: React.FC<RMotionInternalProps> = ({
    forwardRef: ref,
    animate,
    //@ts-ignore
    style,
    onDidAnimate,
    onWillAnimate,
    combineAnimate,
    type,
    duration,
    easing,
    stiffness,
    mass,
    overshootClamping,
    restDisplacementThreshold,
    restSpeedThreshold,
    damping,
    ...rest
  }) => {
    const safeOnWillAnimate = useSafeCallback(onWillAnimate);
    const constant = useConst<{
      animateNodes: ConfRef;
      prevAnimate?: AnimationConf;
      animStyle: any;
    }>({
      animStyle: {},
      animateNodes: {},
    });
    let { animStyle, animateNodes, prevAnimate } = constant;

    if (animate) {
      // 上次的 animate 跟本次的 animate 不一样需要触发动画
      if (!equal(animate, prevAnimate)) {
        // 深拷贝一下，保证后面的操作不会修改到原始的 animate
        const animateCopy = copy(animate!);
        combineAnimations(animateCopy, prevAnimate);
        parseAnimateIntoNodes(animateCopy);
        // 保存本次动画配置，留给下次比对
        constant.prevAnimate = animate!;

        updateAnimateStyle();
      }
    }

    return (
      <AnimatedComponent
        {...(rest as any)}
        ref={ref}
        style={[style, animStyle]}
      />
    );

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

        safeOnWillAnimate();

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

    function combineAnimations(
      current: AnimationConf,
      previous?: AnimationConf,
    ) {
      if (combineAnimate === false || !previous) return;
      // 如果上次动画是[0, 1]而本次动画是[1,0]; 将本次动画中开始的1删除
      keys(current).forEach((key) => {
        if (previous[key]) {
          const prevAnimateItem = toArray(previous[key]!);
          const prevAnimateTo = prevAnimateItem[prevAnimateItem.length - 1];
          // @ts-ignore
          const nextAnimateItem = (current[key] = toArray(current[key]!));
          const nextAnimateFrom = nextAnimateItem[0];
          const animateToValue = isAnyObject(prevAnimateTo)
            ? prevAnimateTo.value
            : prevAnimateTo;
          const nextAnimateFromValue = isAnyObject(nextAnimateFrom)
            ? nextAnimateFrom.value
            : nextAnimateFrom;
          if (nextAnimateFromValue === animateToValue) {
            nextAnimateItem.shift();
          }
        }
      });
    }

    function parseAnimateIntoNodes(animateCopy: AnimationConf) {
      keys(animateNodes).forEach((key) => {
        animateNodes[key].clear();
      });

      keys(animateCopy).forEach((key) => {
        const current = toArray(animateCopy[key]!);
        let i = 0;
        // 如果是一个全新的动画节点，需要初始化一个对应的 Conf
        if (!animateNodes[key]) {
          // 如果是颜色值动画，需要一个特殊处理
          animateNodes[key] = isColor(key)
            ? new ColorConf(current[0])
            : new BasisConf(current[0] as WithConf<number>);
          i++;
        }
        for (let aLen = current.length; i < aLen; i++) {
          animateNodes[key].add(current[i], {
            // @ts-ignore
            type: type,
            duration,
            easing,
            // @ts-ignore
            damping,
            // @ts-ignore
            restDisplacementThreshold,
            // @ts-ignore
            restSpeedThreshold,
            // @ts-ignore
            overshootClamping,
            // @ts-ignore
            mass,
            // @ts-ignore
            stiffness,
          });
        }
      });
    }
  };

  const SequenceMotion: React.FC<{
    children?: React.ReactNode;
    animate?: AnimationConf;
    from?: Partial<AnimateStyle>;
    forwardRef?: React.Ref<any>;
  }> = ({ animate, from, ...rest }) => {
    // 首次加载动画需要考虑到 from，后续就不管 from
    useWillMount(() => {
      if (from && animate) {
        animate = copy(animate!);
        keys(from).forEach((key) => {
          /**
           * 将 from 里面的动画配置拷贝到我们深拷贝的 animate 上去，使 animate 里面的动画配置变成一个数组, 内容如下所示
           * {
           *   opacity: [0, 0,5, {value: 1}],
           * }
           */
          // @ts-ignore
          if (animate![key] != null) {
            // @ts-ignore
            animate![key] = toArray(animate![key]!);
            // @ts-ignore
            animate![key].unshift(from[key]!);
          } else {
            // @ts-ignore
            animate![key] = from[key];
          }
        });
      }
    });

    return <SequenceMotionInternal {...(rest as any)} animate={animate} />;
  };

  const E = EasingNode || Easing;

  SequenceMotion.defaultProps = {
    easing: E.out(E.cubic),
    duration: 300,
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  } as any;

  return SequenceMotion;
}
