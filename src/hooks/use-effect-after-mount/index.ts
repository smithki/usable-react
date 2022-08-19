import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

import { useInitialRender } from '../use-initial-render';

/**
 * Exactly like `useEffect`, except that the effect only
 * executes on subsequent updates after a component mounts.
 */
export function useEffectAfterMount(effect: EffectCallback, deps?: DependencyList) {
  const isInitialRender = useInitialRender();
  const savedCallback = useRef(effect);

  useEffect(() => {
    savedCallback.current = effect;
  }, [effect]);

  useEffect(() => {
    if (!isInitialRender) {
      return savedCallback.current();
    }

    return undefined;
  }, deps);
}
