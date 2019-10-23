import { EffectCallback, useEffect } from 'react';
import { useInitialRender } from './useInitialRender';

/**
 * Exactly like `useEffect` except that the effect only executes on subsequent
 * updates after mounting.
 */
export function useEffectAfterMount(effect: EffectCallback, deps?: readonly any[]) {
  const isInitialRender = useInitialRender();
  useEffect(() => {
    if (!isInitialRender) {
      return effect();
    }
  }, deps);
}
