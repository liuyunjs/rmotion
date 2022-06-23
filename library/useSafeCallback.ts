import { useLayoutEffect } from 'react';
import { useReactCallback } from '@liuyunjs/hooks/lib/useReactCallback';

export const useSafeCallback = <T extends (...args: any[]) => void>(
  callback?: T,
) => {
  let safe = false;
  let fn: (() => void) | null = null;

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    safe = true;
    fn?.();
  });

  return useReactCallback((...args: Parameters<T>) => {
    if (callback) {
      if (safe) {
        callback?.(...args);
      } else {
        fn = () => callback?.(...args);
      }
    }
  });
};
