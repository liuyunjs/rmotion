import * as React from 'react';
import { useReactCallback } from '@liuyunjs/hooks/lib/useReactCallback';

export const useSafeCallback = <T extends (...args: any[]) => void>(
  callback?: T,
) => {
  let safe = false;
  let fn: (() => void) | null = null;

  React.useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    safe = true;
    fn?.();

    return () => {
      // 这是考虑组件卸载后，异步执行的问题
      safe = false;
    };
  });

  return useReactCallback((...args: Parameters<T>) => {
    if (callback) {
      if (safe) {
        callback(...args);
      } else {
        fn = () => callback(...args);
      }
    }
  });
};
