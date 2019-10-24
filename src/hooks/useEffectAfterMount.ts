import { EffectCallback, useEffect, useRef } from 'react';
import { useInitialRender } from './useInitialRender';

/**
 * Exactly like `useEffect` except that the effect only executes on subsequent
 * updates after mounting.
 */
export function useEffectAfterMount(effect: EffectCallback, deps?: readonly any[]) {
  const isInitialRender = useInitialRender();
  const savedCallback = useRef(effect);

  useEffect(() => {
    savedCallback.current = effect;
  }, [effect]);

  useEffect(() => {
    if (!isInitialRender) {
      return savedCallback.current();
    }
  }, deps);
}
