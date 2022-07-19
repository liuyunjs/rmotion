import * as React from 'react';
import { isAnyObject } from '@liuyunjs/utils/lib/isAnyObject';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { usePresence } from 'framer-motion';
import { RMotionProps } from './types';
import { keyframes } from './keyframes';
import { sequence } from './sequence';

export function rmotion<T extends object>(Component: React.ComponentType<T>) {
  const Keyframes = keyframes(Component);
  const Sequence = sequence(Component);

  const Motion = React.forwardRef<any, T & RMotionProps>(function Motion(
    {
      animate,
      exit,
      onDidAnimate,
      onWillAnimate,
      keyframes: enableKeyframes,
      ...rest
    },
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

    const AnimatedComponent = enableKeyframes ? Keyframes : Sequence;

    return (
      <AnimatedComponent
        {...(rest as any)}
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
  });

  Motion.displayName = `rmotion(RMotion${
    Component.displayName || Component.name || 'Component'
  })`;

  return hoistNonReactStatics(Motion, Component);
}
