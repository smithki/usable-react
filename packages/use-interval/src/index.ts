import { EffectCallback, useCallback, useEffect, useRef } from 'react';
import { useEffectTrigger } from '@usable-react/use-effect-trigger';
import { useInitialRender } from '@usable-react/use-initial-render';

/**
 * Executes the given effect on an interval.
 */
export function useInterval(effect: EffectCallback, deps: readonly any[], interval = 1000) {
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
    const id = setTimeout(() => {
      triggerInterval();
    }, interval);
    return () => clearTimeout(id);
  }, [triggerInterval, interval]);

  const clear = useCallback(() => {
    isCleared.current = true;
  }, []);

  return clear;
}
