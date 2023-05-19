import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

import { useCallbackConst } from '../use-callback-const';
import { useEffectTrigger } from '../use-effect-trigger';
import { useInitialRender } from '../use-initial-render';

/**
 * Executes the given effect on an interval.
 */
export function useInterval(effect: EffectCallback, deps: DependencyList, interval = 1000) {
  const savedCallback = useRef(effect);
  const isInitialRender = useInitialRender();
  const isCleared = useRef(false);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = effect;
  }, [effect]);

  // Set up the interval.
  const triggerInterval = useEffectTrigger(() => {
    if (!isInitialRender && !isCleared.current) return savedCallback.current();
    return undefined;
  }, [...deps]);

  useEffect(() => {
    const id = setInterval(() => {
      triggerInterval();
    }, interval);
    return () => clearInterval(id);
  }, [triggerInterval, interval]);

  const clear = useCallbackConst(() => {
    isCleared.current = true;
  });

  return clear;
}
